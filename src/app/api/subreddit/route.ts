import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subredditvalidator } from "@/lib/validators/subreddit";

export async function POST(req: Request){
    try {
        const session = await getAuthSession();

        if(!session?.user){
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { name } = subredditvalidator.parse(body);

        const subredditExists = await db;
    } catch (error) {
        
    }
}