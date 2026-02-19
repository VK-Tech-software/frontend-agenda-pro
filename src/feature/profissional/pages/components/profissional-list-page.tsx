import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface ProfissionalListItem {
	id: number;
	name: string;
	email: string;
	phone?: string;
	specialty?: string;
}

interface ProfissionalListPageProps {
	professionals: ProfissionalListItem[];
	onEdit: (professional: ProfissionalListItem) => void;
	onDelete: (id: number) => void;
	loading?: boolean;
	search?: string;
	onSearchChange?: (value: string) => void;
}

export function ProfissionalListPage({ professionals, onEdit, onDelete, loading, search, onSearchChange }: ProfissionalListPageProps) {
	const filtered = search
		? professionals.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
		: professionals;

	return (
		<div>
			<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
				<input
					className="border rounded px-2 py-1 w-full sm:w-64"
					placeholder="Pesquisar por nome..."
					value={search || ""}
					onChange={(e) => onSearchChange?.(e.target.value)}
					disabled={loading}
				/>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>E-mail</TableHead>
						<TableHead>Telefone</TableHead>
						<TableHead>Especialidade</TableHead>
						<TableHead>Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filtered.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center">Nenhum profissional encontrado</TableCell>
						</TableRow>
					) : (
						filtered.map((p) => (
							<TableRow key={p.id}>
								<TableCell>{p.name}</TableCell>
								<TableCell>{p.email}</TableCell>
								<TableCell>{p.phone || "-"}</TableCell>
								<TableCell>{p.specialty || "-"}</TableCell>
								<TableCell>
									<Button size="icon" variant="ghost" onClick={() => onEdit(p)} disabled={loading}>
										<Pencil size={16} />
									</Button>
									<Button size="icon" variant="ghost" onClick={() => onDelete(p.id)} disabled={loading}>
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
