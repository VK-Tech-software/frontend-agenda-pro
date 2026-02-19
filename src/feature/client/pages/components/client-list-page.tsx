import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface ClientListItem {
	id: number;
	name: string;
	phone?: string;
	origem?: string;
}

interface ClientListPageProps {
	clients: ClientListItem[];
	onEdit: (client: ClientListItem) => void;
	onDelete: (id: number) => void;
	loading?: boolean;
	search?: string;
	onSearchChange?: (value: string) => void;
}

export function ClientListPage({ clients, onEdit, onDelete, loading, search, onSearchChange }: ClientListPageProps) {
	return (
		<div>
			<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
				<input
					className="border rounded px-2 py-1 w-full sm:w-64"
					placeholder="Pesquisar por nome..."
					value={search || ""}
					onChange={e => onSearchChange?.(e.target.value)}
					disabled={loading}
				/>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Telefone</TableHead>
						<TableHead>Origem</TableHead>
						<TableHead>Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{clients.length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} className="text-center">Nenhum cliente encontrado</TableCell>
						</TableRow>
					) : (
						clients.map((c) => (
							<TableRow key={c.id}>
								<TableCell>{c.name}</TableCell>
								<TableCell>{c.phone}</TableCell>
								<TableCell>{c.origem}</TableCell>
								<TableCell>
									<Button size="icon" variant="ghost" onClick={() => onEdit(c)} disabled={loading}>
										<Pencil size={16} />
									</Button>
									<Button size="icon" variant="ghost" onClick={() => onDelete(c.id)} disabled={loading}>
										<Trash2 size={16} />
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
