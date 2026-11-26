# Project brief: Chinese Translate

## The competition

- Presidential SI Challenge (Standard Track), national K–12 competition.
- Age group: Middle school (grades 6–8).
- Judges score a written entry (PDF up to 10 pages) and a video (up to 4 minutes).
- Deadlines: registration December 18 at 5:00pm Eastern; submission December 23, 2026 at 5:00pm Eastern / 2:00pm Pacific.

## The problem

- Chinese people in my school struggle with speaking English because their families only speak Chinese and they got used to only speaking Chinese.
- Impact area: School and learning.
- Impact: They can better understand English, phone calls, people talking, and things at school.
- Evidence: The U.S. Census Bureau found that only 48.2% of Chinese speakers spoke English “very well”; about 51.8% did not.
- Exact evidence page: https://cdn.www.census.gov/newsroom/press-releases/2023/language-at-home-acs-5-year.html
- Person A (Chinese): “When I first came here I struggled with English.”

## My solution

- The AI translates each word or phrase into the family’s language and makes a family-friendly summary of what it means.
- Difference from existing tools: Google Translate and USA Learns can translate or teach, while Chinese Translate adds a clear family-friendly summary and a second version.
- Safety: For medical, emergency, food-allergy, or safety information, show: “Check important information with a trusted adult or professional.” Do not give medical instructions as certain.
- Wrong answer: Let users ask for a second version if the explanation is unclear.

## My MVP features

1. The user can input a word or phrase to translate into Chinese.
2. The user can receive a clear, simple summary of the translation.
3. The user can ask the AI for a second version if the summary seems unclear.
4. The AI gives correct, safe answers to real questions.

## Maybe later (not yet)

- Flag incorrect translations to improve the AI’s learning.
- Glossary of common phrases for daily conversations.
- Cultural tips related to translated content.
- Warning to verify important information with a trusted adult.
- Share translations with family through text or messaging.
- Feedback on AI performance to enhance accuracy.

## My AI’s instructions

- The user takes a picture of words or types words, then presses a button that says translate in English and Chinese.
- Translate the following words into Chinese, then make a summary of what it says.
- Talk to Chinese people who do not really understand English. Use clear, simple language.
- Use the text being translated as the factual source.
- Translate the exact text in the box; do not answer questions, solve problems, or add information that is not in the text.
- If the text is a question, translate the question and summarize what it asks. Do not provide the answer.
- If the text is off-topic, still translate and summarize it without starting a separate conversation.
- Keep names, numbers, dates, directions, and words like “not” accurate. Do not guess when a word is unclear; say what is uncertain.
- If the text asks for unsafe, dangerous, medical, emergency, or food-allergy instructions, translate and summarize it, then add: “Check important information with a trusted adult or professional.” Do not give instructions as if they are certain.
- Do not give medical instructions as if they are certain.
- Translate the text once; do not translate it multiple times to see if it is correct.
- Format the answer like a book: left to right and top to bottom, with a Chinese translation first and a short, simple Chinese summary second.
