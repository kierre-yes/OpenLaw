export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query: string = body.query ?? "";
    const topK: number = body.top_k ?? 5;

    if (!query.trim()) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error("TAVILY_API_KEY is not set in the environment.");
    }
    
    // We append site restrictions to focus on official/trusted Philippine sources
    const enforcedQuery = `${query} (site:lawphil.net OR site:officialgazette.gov.ph OR site:elibrary.judiciary.gov.ph OR site:chanrobles.com)`;
    
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: enforcedQuery,
        search_depth: "advanced",
        include_answer: false,
        include_raw_content: false,
        max_results: topK,
      }),
    });
    
    if (!response.ok) {
      console.error("[Tavily] Search failed:", await response.text());
      return Response.json(
        { error: "Search failed. Try again later." },
        { status: 500 },
      );
    }
    
    const data = await response.json();

    // 3. Return results
    return Response.json({
      query,
      results: data.results.map((r: any, index: number) => ({
        chunk_id: `tavily-${index}`,
        source_title: r.title,
        text_content: r.content,
        metadata: { url: r.url },
      })),
    });
  } catch (error) {
    console.error("[api/search] Error:", error);
    return Response.json(
      { error: "Failed to process search" },
      { status: 500 },
    );
  }
}
