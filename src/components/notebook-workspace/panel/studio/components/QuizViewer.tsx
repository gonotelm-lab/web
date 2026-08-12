import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { workspaceRadius, workspaceSpace } from '../../../shared/ui/layoutTokens'
import { subtleScrollbarSx } from '../../../shared/ui/scrollbar'

export interface QuizQuestion {
  question: string
  options: string[]
  answer_index: number[]
  explanation?: string
}

export interface QuizContent {
  questions: QuizQuestion[]
  themes: string[]
  follow_up_hint: string[]
}

interface QuizViewerProps {
  content: string
  mode?: 'inline' | 'overlay'
}

type QuizPhase = 'answering' | 'summary' | 'review'

const optionLabels = ['A', 'B', 'C', 'D']

const parseQuizContent = (content: string): QuizContent | null => {
  const raw = content.trim()
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as QuizContent
    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const sameAnswerSet = (a: number[] = [], b: number[] = []) => {
  if (a.length !== b.length) return false
  const left = [...a].sort((x, y) => x - y)
  const right = [...b].sort((x, y) => x - y)
  return left.every((value, idx) => value === right[idx])
}

const formatOptionLabels = (indexes: number[] = []) => {
  const labels = [...indexes]
    .sort((a, b) => a - b)
    .map((idx) => optionLabels[idx] || `${idx}`)
  return labels.length > 0 ? labels.join('、') : i18n.t('studio:quiz.unanswered')
}

export function QuizViewer({ content }: QuizViewerProps) {
  const { t } = useTranslation(['studio', 'common'])
  const parsed = useMemo(() => parseQuizContent(content), [content])
  const [activeIndex, setActiveIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number[]>>({})
  const [phase, setPhase] = useState<QuizPhase>('answering')
  const [prevContent, setPrevContent] = useState(content)

  if (content !== prevContent) {
    setPrevContent(content)
    setActiveIndex(0)
    setAnswers({})
    setPhase('answering')
  }

  if (!parsed) {
    return (
      <Alert severity="warning">
        {t('studio:quiz.parseError')}
      </Alert>
    )
  }

  const total = parsed.questions.length
  const safeIndex = Math.min(Math.max(activeIndex, 0), total - 1)
  const question = parsed.questions[safeIndex]
  const correctIndexes = question.answer_index || []
  const isMulti = correctIndexes.length > 1
  const selected = answers[safeIndex] || []
  const answeredCount = Object.values(answers).filter((item) => item.length > 0).length
  const isReview = phase === 'review'
  const isCurrentCorrect = sameAnswerSet(selected, correctIndexes)

  const correctCount = parsed.questions.reduce((sum, item, idx) => (
    sameAnswerSet(answers[idx] || [], item.answer_index || []) ? sum + 1 : sum
  ), 0)

  const toggleOption = (optionIndex: number) => {
    if (phase !== 'answering') return
    setAnswers((prev) => {
      const current = prev[safeIndex] || []
      if (isMulti) {
        const exists = current.includes(optionIndex)
        const next = exists
          ? current.filter((item) => item !== optionIndex)
          : [...current, optionIndex].sort((a, b) => a - b)
        return { ...prev, [safeIndex]: next }
      }
      return { ...prev, [safeIndex]: [optionIndex] }
    })
  }

  const handleSubmit = () => {
    setPhase('summary')
  }

  const handleRetry = () => {
    setAnswers({})
    setPhase('answering')
    setActiveIndex(0)
  }

  if (phase === 'summary') {
    return (
      <Stack
        sx={(theme) => ({
          height: '100%',
          minHeight: 0,
          gap: workspaceSpace.lg,
          overflow: 'auto',
          p: workspaceSpace.xxs,
          ...subtleScrollbarSx(theme),
        })}
      >
        <Box
          sx={{
            borderRadius: workspaceRadius.lg,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
            p: workspaceSpace.lg,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 650 }}>
            {t('studio:quiz.resultTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mt: workspaceSpace.sm }}>
            {t('studio:quiz.score', { correct: correctCount, total })}
            {t('studio:quiz.accuracy', {
              percent: total > 0 ? Math.round((correctCount / total) * 100) : 0,
            })}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: workspaceSpace.sm }}>
            {t('studio:quiz.themes')}
          </Typography>
          <Stack direction="row" spacing={workspaceSpace.sm} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {(parsed.themes || []).map((theme) => (
              <Chip key={theme} size="small" label={theme} />
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: workspaceSpace.sm }}>
            {t('studio:quiz.followUp')}
          </Typography>
          <Stack spacing={workspaceSpace.sm}>
            {(parsed.follow_up_hint || []).map((hint) => (
              <Typography key={hint} variant="body2" color="text.secondary">
                · {hint}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={() => {
              setActiveIndex(0)
              setPhase('review')
            }}
          >
            {t('studio:quiz.review')}
          </Button>
          <Button variant="outlined" onClick={handleRetry}>
            {t('studio:quiz.retry')}
          </Button>
        </Stack>
      </Stack>
    )
  }

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '200px 1fr' },
        gap: workspaceSpace.md,
      }}
    >
      <Box
        sx={(theme) => ({
          borderRadius: workspaceRadius.lg,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          minHeight: 0,
          overflow: 'auto',
          ...subtleScrollbarSx(theme),
        })}
      >
        <Typography variant="caption" color="text.secondary" sx={{ px: workspaceSpace.md, pt: workspaceSpace.md, display: 'block' }}>
          {isReview
            ? t('studio:quiz.reviewHeader', { correct: correctCount, total })
            : t('studio:quiz.listHeader', { answered: answeredCount, total })}
        </Typography>
        <List dense disablePadding sx={{ py: workspaceSpace.xxs }}>
          {parsed.questions.map((item, idx) => {
            const answered = (answers[idx] || []).length > 0
            const multi = (item.answer_index?.length || 0) > 1
            const correct = sameAnswerSet(answers[idx] || [], item.answer_index || [])
            const typeLabel = multi ? t('studio:quiz.multi') : t('studio:quiz.single')
            const secondary = isReview
              ? `${typeLabel} · ${correct ? t('studio:quiz.correct') : t('studio:quiz.wrong')}`
              : `${typeLabel}${answered ? ` · ${t('studio:quiz.answered')}` : ''}`
            return (
              <ListItemButton
                key={`q-${idx}`}
                selected={idx === safeIndex}
                onClick={() => setActiveIndex(idx)}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: idx === safeIndex ? 650 : 500,
                        color: isReview
                          ? (correct ? 'success.main' : 'error.main')
                          : 'text.primary',
                      }}
                    >
                      {t('studio:quiz.questionN', { n: idx + 1 })}
                    </Typography>
                  }
                  secondary={secondary}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      <Stack
        sx={(theme) => ({
          minHeight: 0,
          borderRadius: workspaceRadius.lg,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          p: workspaceSpace.lg,
          gap: workspaceSpace.md,
          overflow: 'auto',
          ...subtleScrollbarSx(theme),
        })}
      >
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t('studio:quiz.progress', {
              n: safeIndex + 1,
              total,
              type: isMulti ? t('studio:quiz.multiQuestion') : t('studio:quiz.singleQuestion'),
            })}
            {isReview
              ? ` · ${isCurrentCorrect ? t('studio:quiz.answerCorrect') : t('studio:quiz.answerWrong')}`
              : ''}
          </Typography>
          {isReview ? (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={() => setPhase('summary')}>
                {t('studio:quiz.backSummary')}
              </Button>
              <Button size="small" variant="contained" onClick={handleRetry}>
                {t('studio:quiz.retry')}
              </Button>
            </Stack>
          ) : (
            <Button
              size="small"
              variant="contained"
              onClick={handleSubmit}
              disabled={answeredCount === 0}
            >
              {t('studio:quiz.submit')}
            </Button>
          )}
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 650, lineHeight: 1.5 }}>
          {question.question}
        </Typography>
        {!isReview && isMulti ? (
          <Typography variant="caption" color="text.secondary">
            {t('studio:quiz.multiHint')}
          </Typography>
        ) : null}

        <Stack spacing={1}>
          {question.options.slice(0, 4).map((option, optionIndex) => {
            const isSelected = selected.includes(optionIndex)
            const isCorrectOption = correctIndexes.includes(optionIndex)
            return (
              <Box
                key={`${safeIndex}-${optionIndex}`}
                role={isReview ? undefined : 'button'}
                tabIndex={isReview ? undefined : 0}
                onClick={() => toggleOption(optionIndex)}
                onKeyDown={(event) => {
                  if (isReview) return
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    toggleOption(optionIndex)
                  }
                }}
                sx={(theme) => {
                  let borderColor: string = theme.palette.divider
                  let bgcolor: string = theme.palette.background.default
                  if (!isReview) {
                    if (isSelected) {
                      borderColor = theme.palette.primary.main
                      bgcolor = theme.palette.action.selected
                    }
                  } else if (isCorrectOption) {
                    borderColor = theme.palette.success.main
                    bgcolor = alpha(theme.palette.success.main, 0.1)
                  } else if (isSelected) {
                    borderColor = theme.palette.error.main
                    bgcolor = alpha(theme.palette.error.main, 0.1)
                  }
                  return {
                    px: workspaceSpace.md,
                    py: workspaceSpace.md,
                    borderRadius: workspaceRadius.md,
                    border: '1px solid',
                    borderColor,
                    bgcolor,
                    cursor: isReview ? 'default' : 'pointer',
                    transition: 'border-color 120ms ease, background-color 120ms ease',
                    ...(!isReview
                      ? {
                          '&:hover': {
                            borderColor: theme.palette.primary.light,
                          },
                        }
                      : {}),
                  }
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  <Box component="span" sx={{ fontWeight: 650, mr: 1 }}>
                    {optionLabels[optionIndex]}.
                  </Box>
                  {option}
                </Typography>
              </Box>
            )
          })}
        </Stack>

        {isReview ? (
          <Box
            sx={{
              borderRadius: workspaceRadius.md,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
              px: workspaceSpace.md,
              py: workspaceSpace.md,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 650, mb: workspaceSpace.sm }}>
              {t('studio:quiz.explanation')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('studio:quiz.yourAnswer', { labels: formatOptionLabels(selected) })}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: workspaceSpace.xxs }}>
              {t('studio:quiz.correctAnswer', { labels: formatOptionLabels(correctIndexes) })}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: workspaceSpace.sm,
                color: isCurrentCorrect ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {isCurrentCorrect ? t('studio:quiz.thisCorrect') : t('studio:quiz.thisWrong')}
            </Typography>
            {question.explanation?.trim() ? (
              <Typography
                variant="body2"
                sx={{ mt: workspaceSpace.sm, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 }}
              >
                {question.explanation.trim()}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.disabled" sx={{ mt: workspaceSpace.sm }}>
                {t('studio:quiz.noExplanation')}
              </Typography>
            )}
          </Box>
        ) : null}

        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: 'center', alignItems: 'center', pt: workspaceSpace.xxs }}
        >
          <IconButton
            size="small"
            aria-label={t('studio:quiz.prevAria')}
            disabled={safeIndex <= 0}
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          >
            <NavigateBeforeRoundedIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 48, textAlign: 'center' }}>
            {safeIndex + 1} / {total}
          </Typography>
          <IconButton
            size="small"
            aria-label={t('studio:quiz.nextAria')}
            disabled={safeIndex >= total - 1}
            onClick={() => setActiveIndex((prev) => Math.min(total - 1, prev + 1))}
          >
            <NavigateNextRoundedIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  )
}
