import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

export interface ProductListItem {
	id: number;
	name: string;
	description?: string;
	price?: number;
	quantity?: number;
}

interface ProductListPageProps {
	products: ProductListItem[];
	onEdit: (product: ProductListItem) => void;
	onDelete: (id: number) => void;
	loading?: boolean;
	search: string;
	onSearchChange: (value: string) => void;
}

export function ProductListPage({ products, onEdit, onDelete, loading, search, onSearchChange }: ProductListPageProps) {
	const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
	return (
		<>
			<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<Input
					placeholder="Buscar produto..."
					value={search}
					onChange={e => onSearchChange(e.target.value)}
					className="w-full sm:w-64"
				/>
			</div>
			{filtered.length === 0 ? (
				<div className="text-center py-8">Nenhum produto</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>Descrição</TableHead>
							<TableHead>Preço</TableHead>
							<TableHead>Qtd</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((p) => (
							<TableRow key={p.id}>
								<TableCell>{p.name}</TableCell>
								<TableCell>{p.description || "-"}</TableCell>
								<TableCell>{p.price !== undefined ? p.price : "-"}</TableCell>
								<TableCell>{p.quantity !== undefined ? p.quantity : "-"}</TableCell>
								<TableCell className="text-right">
									<div className="flex gap-2 justify-end">
										<Button variant="ghost" size="icon" onClick={() => onEdit(p)} disabled={loading}><Pencil className="h-4 w-4"/></Button>
										<Button variant="ghost" size="icon" onClick={() => onDelete(p.id)} disabled={loading}><Trash2 className="h-4 w-4"/></Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
}
