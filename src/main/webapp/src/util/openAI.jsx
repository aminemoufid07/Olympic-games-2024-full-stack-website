import OpenAI from "openai";

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
}

const openai = new OpenAI({
  organization: "org-fCrfEmJ0WFISXeO1mlrOQqkS",
  project: "$proj_Pbl4OSaIAx1OGtZ1SKLThYRu",
});

main();
