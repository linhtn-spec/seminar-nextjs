import { z } from 'zod'

export const testReportSchema = z.object({
  numTotalTests: z.number().int().nonnegative(),
  numPassedTests: z.number().int().nonnegative(),
  numFailedTests: z.number().int().nonnegative(),
  testResults: z.array(z.object({
    name: z.string(),
    assertionResults: z.array(z.object({
      title: z.string(),
      status: z.string(),
      duration: z.number().optional(),
      failureMessages: z.array(z.string()),
    })),
  })),
})

export const testCaseResultSchema = z.object({
  status: z.enum(['passed', 'failed']),
  duration: z.number().optional(),
  file: z.string(),
  location: z.string().optional(),
  failureMessages: z.array(z.string()),
})

export type TestCaseResult = z.infer<typeof testCaseResultSchema>
