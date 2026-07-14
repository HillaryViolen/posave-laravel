interface ResolveBranchIdParams {
    isBranchManager: boolean;
    branches: { id: number; name: string }[];
    filterBranchId?: string;
}

export function resolveBranchId({ isBranchManager, branches, filterBranchId }: ResolveBranchIdParams): number | null {
    if (isBranchManager) {
        return branches[0]?.id ?? null;
    }
    return filterBranchId ? Number(filterBranchId) : null;
}