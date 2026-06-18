import React, { Component, memo } from 'react';
import type { BlockNode } from '@/types';
import { resolveBlock } from '@/registry';

// ─── Error Boundary ───────────────────────────────────────────────────────────
// Wraps each block so a render error in one component does not crash the feed.

type BoundaryState = { hasError: boolean };

class BlockErrorBoundary extends Component<
  { children: React.ReactNode; blockId: string },
  BoundaryState
> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[BlockRenderer] Block render error:', this.props.blockId, error.message);
  }

  render() {
    if (this.state.hasError) {
      // Silent fail — returns null to preserve surrounding tree stability
      return null;
    }
    return this.props.children;
  }
}

// ─── Block Renderer ───────────────────────────────────────────────────────────

type Props = {
  block: BlockNode;
};

function BlockRendererComponent({ block }: Props) {
  const BlockComponent = resolveBlock(block.type);

  if (!BlockComponent) {
    // Unregistered block type — log and drop silently per the resilience mandate
    if (__DEV__) {
      console.warn('[BlockRenderer] Unregistered block type dropped:', block.type, block.id);
    }
    return null;
  }

  return (
    <BlockErrorBoundary blockId={block.id}>
      <BlockComponent block={block} />
    </BlockErrorBoundary>
  );
}

export const BlockRenderer = memo(
  BlockRendererComponent,
  // Custom comparator: only re-render when the block object reference changes.
  // Since the JSON payload is static, this eliminates all re-renders during
  // scroll virtualization cycles.
  (prev, next) => prev.block === next.block,
);
