import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Loader2, CheckCircle, AlertCircle, XCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useJDAnalyzer } from '@/hooks/useJDAnalyzer'

const recommendationConfig = {
  good_fit: {
    label: 'Good Fit',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: CheckCircle,
    description: 'Strong alignment with this role',
  },
  consider: {
    label: 'Worth Considering',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: AlertCircle,
    description: 'Some gaps but could work with learning curve',
  },
  not_ideal: {
    label: 'Probably Not Ideal',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: XCircle,
    description: 'Significant gaps - might not be the best match',
  },
}

export default function JDAnalyzer() {
  const [jobDescription, setJobDescription] = useState('')
  const { result, isAnalyzing, analyze, reset } = useJDAnalyzer()

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return
    await analyze(jobDescription)
  }

  const handleClear = () => {
    setJobDescription('')
    reset()
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Honest Fit Assessment</h2>
          <p className="text-muted-foreground mt-2">
            Paste a job description. I'll tell you honestly if I'm a good fit.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste the full job posting for the most accurate assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[250px] resize-none"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Fit
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                  {(jobDescription || result) && (
                    <Button variant="outline" onClick={handleClear}>
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="glass h-full flex items-center justify-center min-h-[350px]">
                    <div className="text-center">
                      <Loader2 className="size-8 animate-spin mx-auto text-accent" />
                      <p className="mt-4 text-muted-foreground">Analyzing job requirements...</p>
                    </div>
                  </Card>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="glass">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Assessment Results</CardTitle>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{result.matchScore}%</div>
                          <div className="text-xs text-muted-foreground">match score</div>
                        </div>
                      </div>
                      {/* Recommendation Badge */}
                      <div className={`flex items-center gap-2 mt-4 p-3 rounded-lg ${recommendationConfig[result.recommendation].bgColor}`}>
                        {(() => {
                          const Icon = recommendationConfig[result.recommendation].icon
                          return <Icon className={`size-5 ${recommendationConfig[result.recommendation].color}`} />
                        })()}
                        <div>
                          <div className={`font-medium ${recommendationConfig[result.recommendation].color}`}>
                            {recommendationConfig[result.recommendation].label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {recommendationConfig[result.recommendation].description}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary */}
                      <p className="text-sm text-muted-foreground italic border-l-2 border-accent pl-4">
                        "{result.summary}"
                      </p>

                      {/* Strengths */}
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {result.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="size-4 text-green-400 mt-0.5 shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Gaps */}
                      <div>
                        <h4 className="text-sm font-medium text-yellow-400 mb-2">Gaps / Concerns</h4>
                        <ul className="space-y-1">
                          {result.gaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="size-4 text-yellow-400 mt-0.5 shrink-0" />
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="glass h-full flex items-center justify-center min-h-[350px]">
                    <div className="text-center text-muted-foreground">
                      <FileText className="size-12 mx-auto mb-4 opacity-50" />
                      <p>Paste a job description and click "Analyze Fit"</p>
                      <p className="text-sm mt-2">I'll give you an honest assessment</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
