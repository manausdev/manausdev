import { createTaxonomyItem, type TaxonomyCategory } from './model';

export const TAXONOMY_ITEMS = [
  // skills
  createTaxonomyItem('React', 'skills'),
  createTaxonomyItem('TypeScript', 'skills'),
  createTaxonomyItem('Node.js', 'skills'),
  createTaxonomyItem('Python', 'skills'),
  // technologies
  createTaxonomyItem('Next.js', 'technologies'),
  createTaxonomyItem('Supabase', 'technologies'),
  createTaxonomyItem('Docker', 'technologies'),
  // industries
  createTaxonomyItem('Tecnologia', 'industries'),
  createTaxonomyItem('Bioeconomia', 'industries'),
  createTaxonomyItem('Educação', 'industries'),
  // job_types
  createTaxonomyItem('CLT', 'job_types'),
  createTaxonomyItem('PJ', 'job_types'),
  createTaxonomyItem('Estágio', 'job_types'),
  // event_types
  createTaxonomyItem('Meetup', 'event_types'),
  createTaxonomyItem('Hackathon', 'event_types'),
  createTaxonomyItem('Workshop', 'event_types'),
  createTaxonomyItem('Conferência', 'event_types'),
  // community_types
  createTaxonomyItem('Tech', 'community_types'),
  createTaxonomyItem('Design', 'community_types'),
  createTaxonomyItem('Empreendedorismo', 'community_types'),
  // project_types
  createTaxonomyItem('Open Source', 'project_types'),
  createTaxonomyItem('Produto', 'project_types'),
  createTaxonomyItem('Pesquisa', 'project_types'),
  // roles
  createTaxonomyItem('Frontend Engineer', 'roles'),
  createTaxonomyItem('Backend Developer', 'roles'),
  createTaxonomyItem('Fullstack Developer', 'roles'),
  createTaxonomyItem('DevOps Engineer', 'roles'),
  // cities
  createTaxonomyItem('Manaus', 'cities'),
  createTaxonomyItem('Parintins', 'cities'),
  createTaxonomyItem('Itacoatiara', 'cities'),
];

export function getItemsByCategory(category: TaxonomyCategory) {
  return TAXONOMY_ITEMS.filter((i) => i.category === category);
}

export function getItemBySlug(slug: string) {
  return TAXONOMY_ITEMS.find((i) => i.slug === slug) ?? null;
}
