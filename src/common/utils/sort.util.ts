import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
export function applySorting<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, alias: string, allowed: Record<string, string>, sort?: string, order: 'ASC' | 'DESC' = 'ASC') {
    const column = sort && allowed[sort] ? allowed[sort] : allowed['default'];
    const dir: 'ASC' | 'DESC' = order === 'DESC' ? 'DESC' : 'ASC';
    if (column)
        qb.orderBy(`${alias}.${column}`, dir);
    return qb;
}
