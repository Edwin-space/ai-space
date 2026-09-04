# AI Space

AI Space is a category-first AI intelligence/community hub. It is designed to accumulate individual AI stories continuously rather than store only one daily report.

## Information architecture

Each content item can belong to multiple dimensions at the same time.

- `categories`: news, agents, skills-plugins, market-reaction, developer, business, infra, policy, guides
- `entities`: openai, claude, gemini, grok, llama, copilot, apple-ai, open-source
- `type`: release, news, analysis, how-to, community, benchmark, opinion
- `tags`: free-form topics such as MCP, Claude Code, API, benchmark, design, GitHub

Example: a popular Claude Code skill discussed on Reddit can be indexed as:

```json
{
  "categories": ["skills-plugins", "developer", "market-reaction"],
  "entities": ["claude"],
  "type": "community",
  "tags": ["Claude Code", "skills", "Reddit"]
}
```

This lets the same item appear in the Claude hub, Skills & Plugins, Developer, and Market Reaction views without duplicating content.

## Data model

`data/index.json` is the client-side search/list index. For the first version it contains metadata needed to render cards. As content volume grows, full article bodies should live under date-based paths such as:

```text
content/2026/09/05/claude-code-skill-name.json
```

The index should keep only the metadata required for navigation/search.

## Daily publishing rule

The 10:00 KST daily automation should:

1. Research the previous day's meaningful AI changes.
2. Split the research into individual publishable stories instead of publishing only one giant report.
3. Assign multiple categories/entities/tags to each story.
4. Add community reaction as a separate story when it has standalone value.
5. Update `data/index.json` with newest items first.
6. Keep a Daily Brief item that links the day's important stories together.
7. Do not create filler stories when there is no meaningful change.

## Site

The site is static and build-free so it can run directly from GitHub Pages. `index.html`, `styles.css`, and `app.js` render category, entity, search, featured, latest, and trending views from the JSON index.
