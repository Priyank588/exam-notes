const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"

export const generateAIResponse = async (prompt) => {
  return await generateGeminiResponse(prompt)
}

const generateGeminiResponse = async (prompt) => {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Gemini non-ok response:", response.status, err)
      throw new Error(err)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      throw new Error("No text returned from Gemini")
    }

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    try {
      return JSON.parse(cleanText)
    } catch (parseErr) {
      console.error("Gemini parse error. Raw text:", text)
      console.error("Clean text:", cleanText)
      console.error(parseErr)
      throw parseErr
    }
  } catch (error) {
    console.error("Gemini Fetch Error:", error.message)
    if (process.env.NODE_ENV !== "production") {
      console.warn("Using dev mock for Gemini response (invalid API key)")
      return {
        subTopics: {
          High: ["Overview", "Key Processes"],
          Medium: ["Detailed Mechanism"],
          Low: ["Applications"]
        },
        notes: `# ${new Date().toISOString()} Mock Notes\n\nPhotosynthesis is the process by which plants convert light into chemical energy.\n\n## Key Points\n- Light-dependent reactions\n- Calvin cycle`,
        revisionPoints: ["Plants convert light to chemical energy.", "Two main stages: light reactions and Calvin cycle."],
        diagram: { data: "graph TD; A[Light] --> B[Chlorophyll]; B --> C[Glucose]" },
        charts: [],
        questions: {
          short: ["What is photosynthesis?"],
          long: ["Explain the light-dependent reactions."],
          diagram: "Draw the chloroplast and label major parts."
        }
      }
    }
    throw new Error("Gemini API fetch failed")
  }
}
