"""Migrate existing articles and novels to Astro content collections."""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

REPORT_DIR = Path('C:/Users/jkc30/.openclaw/workspace/output/report')
ARTICLES_DIR = Path('C:/Users/jkc30/profji-library/src/content/articles')
NOVELS_DIR = Path('C:/Users/jkc30/profji-library/src/content/novels')

# Category mapping based on article slug
CATEGORIES = {
    'automation-bias': ('AI 심리학', ['자동화편향', '인지편향', 'AI신뢰']),
    'copilot-deskilling': ('AI 심리학', ['코파일럿', '탈숙련화', '개발자']),
    'expertise-in-ai-era': ('AI 심리학', ['전문성', 'AI시대', '인지변화']),
    'hybrid-mind': ('인지 융합', ['하이브리드마인드', '인지융합', '확장된마음']),
    'lost-in-the-middle': ('AI 기술', ['LLM', '컨텍스트윈도우', '주의력']),
    'llm-hallucination-taxonomy': ('AI 기술', ['환각', 'LLM', '분류체계']),
    'rag-limits': ('AI 기술', ['RAG', '검색증강생성', '한계']),
    'local-llm-reality': ('AI 기술', ['로컬LLM', '온디바이스', '현실']),
    'multi-agent-paradox': ('에이전트', ['멀티에이전트', '패러독스', '협업']),
    'agent-orchestration-patterns': ('에이전트', ['오케스트레이션', '에이전트패턴', '설계']),
    'agent-token-economics': ('에이전트', ['토큰경제학', '비용', '에이전트']),
    'prompt-to-agent': ('에이전트', ['프롬프트', '에이전트전환', '진화']),
}

# Skip v2 duplicates
SKIP = {'hybrid-mind_2026-03-03.md', 'multi-agent-paradox_2026-03-03.md'}

count = 0
for md_file in sorted(REPORT_DIR.glob('*.md')):
    if md_file.name in SKIP:
        continue

    text = md_file.read_text(encoding='utf-8-sig')

    # Extract title from first heading
    title_match = re.match(r'#\s+(.+)', text)
    title = title_match.group(1).strip() if title_match else md_file.stem

    # Extract date from filename
    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', md_file.name)
    date = date_match.group(1) if date_match else '2026-03-04'

    # Get slug (remove date and version suffix)
    slug = re.sub(r'_\d{4}-\d{2}-\d{2}(_v\d+)?$', '', md_file.stem)

    # Get category and tags
    cat, tags = CATEGORIES.get(slug, ('미분류', [slug]))

    # Extract first paragraph as description
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip() and not p.strip().startswith('#')]
    desc = paragraphs[0][:150].replace('"', '\\"') if paragraphs else title
    # Clean markdown from description
    desc = re.sub(r'\*+', '', desc)
    desc = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', desc)

    tags_str = '\n'.join(f'  - "{t}"' for t in tags)

    frontmatter = f"""---
title: "{title}"
description: "{desc}"
category: "{cat}"
pubDate: "{date}"
tags:
{tags_str}
---

"""

    # Remove original title line (already in frontmatter)
    body = text
    if title_match:
        body = text[title_match.end():].lstrip('\n')

    out_path = ARTICLES_DIR / f'{slug}.md'
    out_path.write_text(frontmatter + body, encoding='utf-8')
    count += 1
    print(f'  Article: {slug}.md ({cat})')

print(f'\nMigrated {count} articles.')

# Migrate novels from docx (extract text)
try:
    from docx import Document

    novel_files = [
        ('AI시대_인간직장인생존법_1편_새로운동료.docx', 1, '새로운 동료'),
        ('AI시대_인간직장인생존법_2편_적응의기술.docx', 2, '적응의 기술'),
        ('AI시대_인간직장인생존법_3편_공존의공식.docx', 3, '공존의 공식'),
    ]

    novel_dir = Path('C:/Users/jkc30/.openclaw/workspace/output/novel')

    for fname, ep, subtitle in novel_files:
        fpath = novel_dir / fname
        if not fpath.exists():
            continue

        doc = Document(str(fpath))
        body = '\n\n'.join(p.text for p in doc.paragraphs if p.text.strip())

        frontmatter = f"""---
title: "AI시대 인간 직장인 생존법 {ep}편: {subtitle}"
description: "AI 에이전트 '아리'의 시선으로 바라본 직장 내 AI 도입기 {ep}편"
series: "AI시대 인간 직장인 생존법"
episode: {ep}
pubDate: "2026-03-03"
---

"""

        out_path = NOVELS_DIR / f'ai-survival-ep{ep}.md'
        out_path.write_text(frontmatter + body, encoding='utf-8')
        print(f'  Novel: ai-survival-ep{ep}.md')

    print(f'\nMigrated {len(novel_files)} novels.')
except ImportError:
    print('python-docx not found, skipping novels')

print('\nDone!')
