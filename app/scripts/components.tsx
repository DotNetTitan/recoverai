'use client';
import { ArrowLeft, CheckCircle, Copy, RefreshCw, Volume2 } from 'lucide-react';
import { CONTEXT_TAGS, SCRIPT_TYPES } from '@/utils/constants';
import styles from './page.module.css';

type ScriptType = typeof SCRIPT_TYPES[number];

interface ScriptTypeSelectorProps {
  iconMap: Record<string, React.ElementType>;
  onSelect: (type: ScriptType) => void;
}

interface ScriptContextSelectorProps {
  onBack: () => void;
  onSelect: (context: string) => void;
}

interface ScriptResponseProps {
  actionError: string | null;
  copied: boolean;
  largeFont: boolean;
  scriptContent: string;
  selectedContext: string | null;
  selectedType: ScriptType | null;
  onCopy: () => void;
  onDone: () => void;
  onRegenerate: () => void;
  onSpeak: (text: string) => void;
  onToggleFont: () => void;
}

export function ScriptTypeSelector({ iconMap, onSelect }: ScriptTypeSelectorProps) {
  return (
    <>
      <div>
        <h2 className={styles.prompt}>What do you need to say?</h2>
        <p className={styles.subPrompt}>AI will help you find the right words.</p>
      </div>
      <div className="stack">
        {SCRIPT_TYPES.map((type) => {
          const Icon = iconMap[type.id];
          return (
            <button key={type.id} className="card-crisis" onClick={() => onSelect(type)}>
              <Icon size={24} color="var(--color-mint-tint)" />
              <span className={styles.optionLabel}>{type.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function ScriptContextSelector({ onBack, onSelect }: ScriptContextSelectorProps) {
  return (
    <>
      <div>
        <h2 className={styles.prompt}>What&apos;s the situation?</h2>
        <p className={styles.subPrompt}>Select a context to personalize your script.</p>
      </div>
      <div className={styles.chipWrap}>
        {CONTEXT_TAGS.map((tag) => (
          <button key={tag} className="chip" onClick={() => onSelect(tag)}>
            {tag}
          </button>
        ))}
      </div>
      <button className="btn btn-outline btn-full" onClick={onBack}>
        <ArrowLeft size={20} /> Back to scripts
      </button>
    </>
  );
}

export function ScriptResponse({
  actionError,
  copied,
  largeFont,
  scriptContent,
  selectedContext,
  selectedType,
  onCopy,
  onDone,
  onRegenerate,
  onSpeak,
  onToggleFont,
}: ScriptResponseProps) {
  return (
    <div className="stack">
      {actionError && (
        <div className="card" role="alert">
          <p>{actionError}</p>
        </div>
      )}
      <div className={styles.scriptCard}>
        <div className={styles.scriptHeader}>
          <span className={styles.scriptType}>{selectedType?.label}</span>
          <span className={styles.scriptContext}>{selectedContext}</span>
        </div>
        <div className={styles.scriptBody}>
          {scriptContent.split('\n\n').map((para) => (
            <p key={para} className={`${styles.scriptParagraph} ${largeFont ? styles.scriptParagraphLarge : ''}`} onClick={() => onSpeak(para)}>
              {para}
            </p>
          ))}
        </div>
        <p className={styles.tapToRead}>Tap any paragraph to hear it out loud.</p>
      </div>

      <div className="grid-2">
        <button className="btn btn-ghost" onClick={onToggleFont}>
          {largeFont ? 'Smaller text' : 'Larger text'}
        </button>
      </div>

      <div className="grid-2">
        <button className="btn btn-outline" onClick={() => onSpeak(scriptContent)}>
          <Volume2 size={20} /> Listen All
        </button>
        <button className="btn btn-outline" onClick={onCopy}>
          {copied ? (
            <>
              <CheckCircle size={20} color="var(--color-mint-tint)" /> Copied
            </>
          ) : (
            <>
              <Copy size={20} /> Copy
            </>
          )}
        </button>
      </div>

      <button className="btn btn-ghost btn-full" onClick={onRegenerate}>
        <RefreshCw size={20} /> Regenerate
      </button>

      <button className="btn btn-primary btn-full" onClick={onDone}>
        Done
      </button>
    </div>
  );
}
