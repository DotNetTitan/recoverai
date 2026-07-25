'use client';
import { ChevronRight, Search, Volume2 } from 'lucide-react';
import { EDUCATION_CATEGORIES } from '@/utils/constants';
import { AiStatus } from '@/components/AiStatus';
import styles from './page.module.css';

interface EducationQaProps {
  answer: string;
  error: string | null;
  loading: boolean;
  query: string;
  onAsk: (event: React.FormEvent) => void;
  onQueryChange: (query: string) => void;
  onSpeak: (text: string) => void;
}

interface EducationCategoriesProps {
  iconMap: Record<string, React.ElementType>;
}

export function EducationQa({
  answer,
  error,
  loading,
  query,
  onAsk,
  onQueryChange,
  onSpeak,
}: EducationQaProps) {
  return (
    <div className={styles.qaSection}>
      <h2 className={styles.sectionTitle}>Ask a Question</h2>
      <form onSubmit={onAsk} className={styles.searchForm}>
        <input
          type="text"
          className="input"
          placeholder="E.g., What are common withdrawal signs?"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !query.trim()}>
          <Search size={20} />
        </button>
      </form>

      <AiStatus
        error={error}
        loading={loading}
        loadingClassName={styles.loadingAnswer}
        skeletonHeight={80}
      />

      {answer && !loading && (
        <div className={styles.answerCard}>
          <p className={styles.answerText}>{answer}</p>
          <div className={styles.answerActions}>
            <button className="btn btn-ghost" onClick={() => onSpeak(answer)}>
              <Volume2 size={18} /> Read aloud
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EducationCategories({ iconMap }: EducationCategoriesProps) {
  return (
    <div className={styles.categoriesSection}>
      <h2 className={styles.sectionTitle}>Curated Topics</h2>
      <div className="stack">
        {EDUCATION_CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <div key={cat.id} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <Icon size={24} color="var(--color-mint-tint)" />
                <h3 className={styles.categoryTitle}>{cat.title}</h3>
              </div>
              <div className={styles.articleList}>
                {cat.articles.map((article) => (
                  <button key={article} className={styles.articleLink}>
                    {article} <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
