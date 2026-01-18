/**
 * Test PoW Solver Component
 * Quick test to see if the solver works
 * 
 * Run this to verify PoW is working before integrating into modal
 */

'use client';

import { useState } from 'react';
import { solveChallenge, estimateSolvingTime } from '@/lib/pow-solver';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function TestPoWSolver() {
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<{
        solution: number;
        time: number;
        difficulty: number;
    } | null>(null);

    async function runTest() {
        setIsRunning(true);
        setProgress(0);
        setResult(null);

        const challenge = 'test_' + Date.now();
        const difficulty = 4; // Medium difficulty

        const startTime = Date.now();

        try {
            const solution = await solveChallenge(challenge, difficulty, (p) => {
                setProgress(p);
            });

            const elapsed = Date.now() - startTime;

            setResult({
                solution,
                time: elapsed,
                difficulty
            });

            setProgress(100);
        } catch (error: any) {
            console.error('PoW failed:', error);
            alert('PoW solving failed: ' + error.message);
        } finally {
            setIsRunning(false);
        }
    }

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>🔧 PoW Solver Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={runTest}
                    disabled={isRunning}
                    className="w-full"
                >
                    {isRunning ? 'Solving...' : 'Run PoW Test'}
                </Button>

                {isRunning && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                        <p className="text-sm text-gray-600">
                            Estimated: {estimateSolvingTime(4)}ms
                        </p>
                    </div>
                )}

                {result && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-green-800">✅ Success!</h4>
                        <div className="text-sm space-y-1">
                            <div><strong>Solution:</strong> {result.solution}</div>
                            <div><strong>Time:</strong> {result.time}ms</div>
                            <div><strong>Difficulty:</strong> {result.difficulty}</div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
