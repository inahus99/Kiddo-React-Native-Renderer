import type { ComponentType } from 'react';
import type { BlockNode, KnownBlockType } from '@/types';

export type BlockComponentProps<T extends BlockNode = BlockNode> = {
  block: T;
};

type RegistryMap = Partial<Record<KnownBlockType, ComponentType<BlockComponentProps<BlockNode>>>>;

const registry: RegistryMap = {};

export function registerBlock<T extends BlockNode>(
  type: KnownBlockType,
  component: ComponentType<BlockComponentProps<T>>,
): void {
  registry[type] = component as ComponentType<BlockComponentProps<BlockNode>>;
}

export function resolveBlock(
  type: string,
): ComponentType<BlockComponentProps<BlockNode>> | null {
  const knownType = type as KnownBlockType;
  return registry[knownType] ?? null;
}

export function getRegisteredTypes(): string[] {
  return Object.keys(registry);
}
