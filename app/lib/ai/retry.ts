/**
 * 指数バックオフ付きリトライ関数
 * @param fn 実行したい関数（例：() => ai.models.generateContent({...})）
 * @param retries リトライ回数
 * @param delay 初回ディレイ（ミリ秒）
 */

export async function retryWithExponentialBackoff(
    fn: () => Promise<any>,
    retries = 5,
    delay = 300
) {
    try {
        return await fn();
    } catch (error: any) {
        if (
            !error.status || // status がない謎エラー
            error.status !== 503 || // 503 以外はリトライ不要
            retries === 0
        ) {
            throw error;
        }
        console.warn(
            `Retrying... remaining=${retries}, wait=${delay}ms, reason=${error.status}`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));

        return retryWithExponentialBackoff(fn, retries - 1, delay * 2);
    }
}