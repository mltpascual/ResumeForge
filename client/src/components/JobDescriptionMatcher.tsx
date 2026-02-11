import { useState, useMemo, useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, X, Sparkles, CheckCircle2, XCircle, TrendingUp,
  Copy, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Stop words to filter out common non-meaningful words ──
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need',
  'must', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you',
  'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my',
  'your', 'his', 'our', 'their', 'what', 'which', 'who', 'whom', 'how',
  'when', 'where', 'why', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'because', 'if', 'while', 'about',
  'up', 'out', 'also', 'then', 'into', 'over', 'after', 'before', 'between',
  'under', 'through', 'during', 'above', 'below', 'any', 'new', 'work',
  'working', 'including', 'include', 'includes', 'etc', 'e.g', 'ie', 'eg',
  'able', 'across', 'well', 'within', 'without', 'using', 'used', 'use',
  'based', 'related', 'required', 'preferred', 'plus', 'strong', 'excellent',
  'good', 'great', 'best', 'high', 'highly', 'minimum', 'least', 'per',
  'year', 'years', 'experience', 'role', 'position', 'job', 'company',
  'team', 'will', 'looking', 'join', 'opportunity', 'responsibilities',
  'requirements', 'qualifications', 'benefits', 'salary', 'compensation',
  'equal', 'employer', 'apply', 'application', 'candidate', 'candidates',
  'ideal', 'successful', 'day', 'time', 'full', 'part', 'level',
]);

// ── Common multi-word technical/professional phrases ──
const MULTI_WORD_PATTERNS = [
  'machine learning', 'deep learning', 'artificial intelligence', 'natural language processing',
  'computer vision', 'data science', 'data engineering', 'data analysis', 'data analytics',
  'project management', 'product management', 'product design', 'user experience',
  'user interface', 'user research', 'design systems', 'design thinking',
  'full stack', 'front end', 'back end', 'cloud computing', 'ci cd', 'ci/cd',
  'version control', 'agile methodology', 'scrum master', 'cross functional',
  'supply chain', 'business intelligence', 'quality assurance', 'test driven',
  'object oriented', 'rest api', 'restful api', 'graphql api',
  'react native', 'node js', 'next js', 'vue js', 'angular js',
  'type script', 'java script', 'power bi', 'google cloud', 'amazon web services',
  'microsoft azure', 'sql server', 'no sql', 'time series', 'real time',
  'open source', 'problem solving', 'critical thinking', 'decision making',
  'stakeholder management', 'change management', 'risk management',
  'continuous integration', 'continuous deployment', 'software development',
  'software engineering', 'systems design', 'api design', 'database design',
  'responsive design', 'mobile development', 'web development',
  'technical writing', 'public speaking', 'team leadership',
];

interface KeywordMatch {
  keyword: string;
  found: boolean;
  frequency: number; // frequency in job description
  isMultiWord: boolean;
}

interface MatchResult {
  matchedKeywords: KeywordMatch[];
  missingKeywords: KeywordMatch[];
  matchPercentage: number;
  totalKeywords: number;
}

function extractKeywords(text: string): { singles: Map<string, number>; multiWords: Map<string, number> } {
  const lower = text.toLowerCase();
  const multiWords = new Map<string, number>();

  // Extract multi-word phrases first
  for (const phrase of MULTI_WORD_PATTERNS) {
    const regex = new RegExp(phrase.replace(/[\/\s]+/g, '[\\s/]+'), 'gi');
    const matches = lower.match(regex);
    if (matches) {
      multiWords.set(phrase, matches.length);
    }
  }

  // Extract single words (excluding stop words and very short words)
  const words = lower.replace(/[^a-z0-9+#./-]/g, ' ').split(/\s+/).filter(Boolean);
  const singles = new Map<string, number>();

  for (const word of words) {
    if (word.length < 3 || STOP_WORDS.has(word)) continue;
    // Skip pure numbers
    if (/^\d+$/.test(word)) continue;
    singles.set(word, (singles.get(word) || 0) + 1);
  }

  // Remove single words that are part of matched multi-word phrases
  for (const phrase of Array.from(multiWords.keys())) {
    const parts = phrase.split(/\s+/);
    for (const part of parts) {
      singles.delete(part);
    }
  }

  // Only keep words that appear at least once and are likely meaningful
  // Filter out words with frequency 1 that are too generic
  const filtered = new Map<string, number>();
  Array.from(singles.entries()).forEach(([word, count]) => {
    if (count >= 2 || word.length >= 4) {
      filtered.set(word, count);
    }
  });

  return { singles: filtered, multiWords };
}

function getResumeText(resumeData: ReturnType<typeof useResume>['resumeData']): string {
  const pi = resumeData.personalInfo;
  const parts = [
    pi.fullName, pi.title, pi.summary,
    ...resumeData.experiences.flatMap(e => [e.position, e.company, e.location, e.description]),
    ...resumeData.education.flatMap(e => [e.institution, e.degree, e.field, e.description]),
    resumeData.skills,
    ...resumeData.projects.flatMap(p => [p.name, p.description, p.technologies]),
    ...resumeData.certifications.flatMap(c => [c.name, c.issuer]),
  ];
  return parts.filter(Boolean).join(' ');
}

function matchKeywords(jobText: string, resumeText: string): MatchResult {
  const jobKeywords = extractKeywords(jobText);
  const resumeLower = resumeText.toLowerCase();

  const allMatches: KeywordMatch[] = [];

  // Check multi-word phrases
  Array.from(jobKeywords.multiWords.entries()).forEach(([phrase, freq]) => {
    const regex = new RegExp(phrase.replace(/[\/\s]+/g, '[\\s/]+'), 'i');
    allMatches.push({
      keyword: phrase,
      found: regex.test(resumeLower),
      frequency: freq,
      isMultiWord: true,
    });
  });

  // Check single keywords
  Array.from(jobKeywords.singles.entries()).forEach(([word, freq]) => {
    // Check if word appears in resume (with word boundary awareness)
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    allMatches.push({
      keyword: word,
      found: regex.test(resumeLower),
      frequency: freq,
      isMultiWord: false,
    });
  });

  // Sort by frequency (most important keywords first), then by multi-word (more specific first)
  allMatches.sort((a, b) => {
    if (a.isMultiWord !== b.isMultiWord) return a.isMultiWord ? -1 : 1;
    return b.frequency - a.frequency;
  });

  const matched = allMatches.filter(m => m.found);
  const missing = allMatches.filter(m => !m.found);
  const matchPercentage = allMatches.length > 0 ? Math.round((matched.length / allMatches.length) * 100) : 0;

  return {
    matchedKeywords: matched,
    missingKeywords: missing,
    matchPercentage,
    totalKeywords: allMatches.length,
  };
}

function getMatchColor(pct: number) {
  if (pct >= 75) return '#15803D';
  if (pct >= 50) return '#A16207';
  if (pct >= 25) return '#C2410C';
  return '#B91C1C';
}

function getMatchLabel(pct: number) {
  if (pct >= 75) return 'Strong Match';
  if (pct >= 50) return 'Good Match';
  if (pct >= 25) return 'Needs Work';
  return 'Low Match';
}

export default function JobDescriptionMatcher() {
  const { resumeData } = useResume();
  const [expanded, setExpanded] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showMatched, setShowMatched] = useState(false);
  const [showMissing, setShowMissing] = useState(true);

  const resumeText = useMemo(() => getResumeText(resumeData), [resumeData]);

  const result = useMemo(() => {
    if (!jobDescription.trim()) return null;
    return matchKeywords(jobDescription, resumeText);
  }, [jobDescription, resumeText]);

  const handleCopyMissing = useCallback(() => {
    if (!result) return;
    const missing = result.missingKeywords.map(k => k.keyword).join(', ');
    navigator.clipboard.writeText(missing);
    toast.success('Missing keywords copied to clipboard');
  }, [result]);

  const handleClear = useCallback(() => {
    setJobDescription('');
    toast.success('Job description cleared');
  }, []);

  const color = result ? getMatchColor(result.matchPercentage) : 'var(--md3-on-surface-variant)';

  return (
    <>
      {/* Trigger button in header */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full"
            onClick={() => setExpanded(true)}
          >
            <Target className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Job description matcher</TooltipContent>
      </Tooltip>

      {/* Full modal panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setExpanded(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col mx-4"
              style={{ background: 'var(--md3-surface-container-lowest)', border: '1px solid var(--md3-outline-variant)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="shrink-0 p-5 pb-4 flex items-start justify-between" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <Target className="size-5" style={{ color: 'var(--md3-primary)' }} />
                    <h3 className="font-display text-lg font-semibold">Job Description Matcher</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste a job posting to see how well your resume matches the required keywords.
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="size-9 rounded-full shrink-0" onClick={() => setExpanded(false)}>
                  <X className="size-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Textarea */}
                <div className="p-5 pb-3">
                  <div className="relative">
                    <textarea
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here...&#10;&#10;Example: We are looking for a Senior Software Engineer with experience in React, TypeScript, Node.js, and cloud infrastructure (AWS/GCP). The ideal candidate will have 5+ years of experience building scalable web applications..."
                      className="w-full h-40 p-4 text-sm rounded-xl resize-none focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: 'var(--md3-surface-container)',
                        border: '1px solid var(--md3-outline-variant)',
                        color: 'var(--md3-on-surface)',

                      }}
                    />
                    {jobDescription && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 rounded-full opacity-60 hover:opacity-100" onClick={handleClear}>
                              <Trash2 className="size-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Clear</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground">
                      {jobDescription.split(/\s+/).filter(Boolean).length} words
                    </span>
                    {result && (
                      <span className="text-[11px] text-muted-foreground">
                        {result.totalKeywords} keywords extracted
                      </span>
                    )}
                  </div>
                </div>

                {/* Results */}
                {result && result.totalKeywords > 0 && (
                  <div className="px-5 pb-5 space-y-4">
                    {/* Score overview */}
                    <div
                      className="p-4 rounded-xl"
                      style={{ background: 'var(--md3-surface-container)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-display text-3xl font-bold" style={{ color }}>
                              {result.matchPercentage}%
                            </span>
                          </div>
                          <div
                            className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: `${color}18`, color }}
                          >
                            {getMatchLabel(result.matchPercentage)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="size-3.5" style={{ color: '#15803D' }} />
                              <span className="font-medium">{result.matchedKeywords.length} found</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <XCircle className="size-3.5" style={{ color: '#B91C1C' }} />
                              <span className="font-medium">{result.missingKeywords.length} missing</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--md3-outline-variant)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.matchPercentage}%` }}
                          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
                        />
                      </div>
                    </div>

                    {/* Missing keywords section */}
                    {result.missingKeywords.length > 0 && (
                      <div>
                        <button
                          onClick={() => setShowMissing(!showMissing)}
                          className="w-full flex items-center justify-between py-2 group"
                        >
                          <div className="flex items-center gap-2">
                            <XCircle className="size-4" style={{ color: '#B91C1C' }} />
                            <h4 className="text-sm font-display font-semibold">
                              Missing Keywords ({result.missingKeywords.length})
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => { e.stopPropagation(); handleCopyMissing(); }}
                                >
                                  <Copy className="size-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy missing keywords</TooltipContent>
                            </Tooltip>
                            {showMissing ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                          </div>
                        </button>
                        <AnimatePresence>
                          {showMissing && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-wrap gap-1.5 pt-1 pb-2">
                                {result.missingKeywords.map((kw, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                                    style={{
                                      background: '#B91C1C14',
                                      color: '#B91C1C',
                                      border: '1px solid #B91C1C30',
                                    }}
                                  >
                                    {kw.keyword}
                                    {kw.frequency > 1 && (
                                      <span className="text-[10px] opacity-60">×{kw.frequency}</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                                <Sparkles className="size-3" />
                                Consider adding these keywords to your resume where relevant.
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Matched keywords section */}
                    {result.matchedKeywords.length > 0 && (
                      <div>
                        <button
                          onClick={() => setShowMatched(!showMatched)}
                          className="w-full flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4" style={{ color: '#15803D' }} />
                            <h4 className="text-sm font-display font-semibold">
                              Matched Keywords ({result.matchedKeywords.length})
                            </h4>
                          </div>
                          {showMatched ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                        </button>
                        <AnimatePresence>
                          {showMatched && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-wrap gap-1.5 pt-1 pb-2">
                                {result.matchedKeywords.map((kw, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                    style={{
                                      background: '#15803D14',
                                      color: '#15803D',
                                      border: '1px solid #15803D30',
                                    }}
                                  >
                                    {kw.keyword}
                                    {kw.frequency > 1 && (
                                      <span className="text-[10px] opacity-60">×{kw.frequency}</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Suggestions */}
                    <div
                      className="p-4 rounded-xl space-y-2"
                      style={{ background: 'var(--md3-surface-container)', border: '1px solid var(--md3-outline-variant)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="size-4" style={{ color: 'var(--md3-primary)' }} />
                        <h4 className="text-xs font-display font-semibold uppercase tracking-wider">Quick Tips</h4>
                      </div>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {result.matchPercentage < 50 && (
                          <li className="flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>Your resume matches less than half the keywords. Focus on adding the most frequently mentioned missing terms to your skills and experience sections.</span>
                          </li>
                        )}
                        {result.missingKeywords.filter(k => k.isMultiWord).length > 0 && (
                          <li className="flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>
                              Missing key phrases: {result.missingKeywords.filter(k => k.isMultiWord).slice(0, 3).map(k => `"${k.keyword}"`).join(', ')}. Add these exact phrases where they apply.
                            </span>
                          </li>
                        )}
                        {result.missingKeywords.filter(k => k.frequency >= 2).length > 0 && (
                          <li className="flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>
                              High-priority keywords (mentioned {'>'}1 time): {result.missingKeywords.filter(k => k.frequency >= 2).slice(0, 5).map(k => `"${k.keyword}"`).join(', ')}.
                            </span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">•</span>
                          <span>Weave keywords naturally into your experience bullet points rather than just listing them in skills.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">•</span>
                          <span>Mirror the exact phrasing from the job description — ATS systems often do exact-match keyword scanning.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!result && (
                  <div className="px-5 pb-5">
                    <div
                      className="py-12 text-center rounded-xl"
                      style={{ background: 'var(--md3-surface-container)', border: '1px dashed var(--md3-outline-variant)' }}
                    >
                      <Target className="size-8 mx-auto mb-3 text-muted-foreground opacity-40" />
                      <p className="text-sm text-muted-foreground font-medium">Paste a job description above</p>
                      <p className="text-xs text-muted-foreground mt-1 opacity-70">
                        We'll extract keywords and show which ones your resume is missing.
                      </p>
                    </div>
                  </div>
                )}

                {/* No keywords extracted state */}
                {result && result.totalKeywords === 0 && (
                  <div className="px-5 pb-5">
                    <div
                      className="py-8 text-center rounded-xl"
                      style={{ background: 'var(--md3-surface-container)', border: '1px dashed var(--md3-outline-variant)' }}
                    >
                      <p className="text-sm text-muted-foreground font-medium">No meaningful keywords found</p>
                      <p className="text-xs text-muted-foreground mt-1 opacity-70">
                        Try pasting a longer or more detailed job description.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="shrink-0 px-5 py-3 text-center" style={{ borderTop: '1px solid var(--md3-outline-variant)', background: 'var(--md3-surface-container)' }}>
                <p className="text-[11px] text-muted-foreground">
                  Keyword matching is approximate. Always tailor your resume thoughtfully — don't just stuff keywords.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
