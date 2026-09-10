import {SqlUtil} from "@/app/utils/sqlUtil";
import {ApiUtil} from "@/app/utils/apiUtils";
import {Page} from "@/app/modeles";

export async function GET() {
    try {
        const sql = SqlUtil.getSql();
        const pages =  await sql`SELECT * FROM pages` as unknown as Page[]
        return ApiUtil.getSuccessNextResponse<Page[]>(pages);
    } catch (error) {
        return ApiUtil.handleNextErrors(error as Error);
    }
}