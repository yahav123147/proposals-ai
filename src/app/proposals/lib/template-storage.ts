import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";
import type { CustomTemplate } from "./types";

const STORE_NAME = "proposal-custom-templates";
const INDEX_KEY = "__index__";

interface TemplateIndex {
  ids: string[];
}

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

async function getIndex(): Promise<TemplateIndex> {
  const blob = await store().get(INDEX_KEY, { type: "json" });
  return (blob as TemplateIndex | null) ?? { ids: [] };
}

async function saveIndex(index: TemplateIndex) {
  await store().setJSON(INDEX_KEY, index);
}

export async function listCustomTemplates(): Promise<CustomTemplate[]> {
  const index = await getIndex();
  const templates: CustomTemplate[] = [];
  for (const id of index.ids) {
    const t = await store().get(id, { type: "json" });
    if (t) templates.push(t as CustomTemplate);
  }
  return templates.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getCustomTemplate(
  id: string
): Promise<CustomTemplate | null> {
  const blob = await store().get(id, { type: "json" });
  return (blob as CustomTemplate | null) ?? null;
}

export async function createCustomTemplate(
  data: Omit<CustomTemplate, "id" | "createdAt">
): Promise<CustomTemplate> {
  const id = randomUUID();
  const template: CustomTemplate = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };
  await store().setJSON(id, template);
  const index = await getIndex();
  index.ids.push(id);
  await saveIndex(index);
  return template;
}

export async function deleteCustomTemplate(id: string): Promise<boolean> {
  const existing = await getCustomTemplate(id);
  if (!existing) return false;
  await store().delete(id);
  const index = await getIndex();
  index.ids = index.ids.filter((x) => x !== id);
  await saveIndex(index);
  return true;
}
