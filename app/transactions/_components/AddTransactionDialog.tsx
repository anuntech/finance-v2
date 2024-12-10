"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { useRouter } from 'next/navigation';
import { format, addMonths, addDays, addWeeks, addYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

// ---------------------- TYPES & CONSTANTS ----------------------

type RecorrenciaType = 'unico' | 'parcelar' | 'repetir';
type FrequenciaType =
  | 'semanal'
  | 'quinzenal'
  | 'mensal'
  | 'bimestral'
  | 'trimestral'
  | 'anual';

interface Parcela {
  valor: number;
  vencimento?: Date;
  competencia?: Date;
  segundaData?: Date;
  dayOfWeek?: number;
}

/** Base classes to ensure consistent styling across inputs and combo boxes. */
const baseFieldClasses =
  "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm " +
  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 " +
  "focus:ring-ring focus:ring-offset-2 ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50 text-foreground";

// ---------------------- UTILITY FUNCTIONS ----------------------

/**
 * Formats a numeric value (in cents) to Brazilian Real currency format.
 * Ensures consistent formatting across the app.
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
}

/** 
 * Calculates the next date based on a given frequency. 
 * This centralizes logic for date increments, making it easier to maintain.
 */
function calculateNextDate(
  startDate: Date,
  increment: number,
  frequencia: FrequenciaType
): Date {
  switch (frequencia) {
    case 'semanal':
      return addWeeks(startDate, increment);
    case 'quinzenal':
      return addDays(startDate, increment * 15);
    case 'mensal':
      return addMonths(startDate, increment);
    case 'bimestral':
      return addMonths(startDate, increment * 2);
    case 'trimestral':
      return addMonths(startDate, increment * 3);
    case 'anual':
      return addYears(startDate, increment);
    default:
      return startDate;
  }
}

// ---------------------- SUB-COMPONENTS ----------------------

interface DatePickerProps {
  label?: string;
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

/** 
 * Generic DatePicker component integrated with a Popover & Calendar.
 * Keeps code DRY since Date Pickers are used multiple times.
 */
function DatePicker({ label, selectedDate, onSelect }: DatePickerProps) {
  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              baseFieldClasses,
              'justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? format(selectedDate, 'PPP', { locale: ptBR })
              : 'Selecionar Data'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelect}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface UnicoFormProps {
  dateVencimento: Date;
  setDateVencimento: (date: Date) => void;
  dateCompetencia: Date;
  setDateCompetencia: (date: Date) => void;
}

/**
 * Form section for "Pagamento Único".
 * Keeps code modular and easy to maintain as the logic or layout evolves.
 */
function UnicoForm({
  dateVencimento,
  setDateVencimento,
  dateCompetencia,
  setDateCompetencia,
}: UnicoFormProps) {
  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <DatePicker
          label="Data de Vencimento"
          selectedDate={dateVencimento}
          onSelect={setDateVencimento}
        />
      </div>
      <div className="flex-1">
        <DatePicker
          label="Data de Competência"
          selectedDate={dateCompetencia}
          onSelect={setDateCompetencia}
        />
      </div>
    </div>
  );
}

interface ParcelarFormProps {
  parcelas: number;
  setParcelas: Dispatch<SetStateAction<number>>;
  frequencia: FrequenciaType;
  setFrequencia: Dispatch<SetStateAction<FrequenciaType>>;
  parcelasPreview: Parcela[];
  setParcelasPreview: Dispatch<SetStateAction<Parcela[]>>;
  handleParcelaChange: (index: number, newValue: number) => void;
  handleDayOfWeekChange: (index: number, newDayOfWeek: number) => void;
  handleDateChange: (
    index: number,
    selectedDate: Date,
    field: 'vencimento' | 'competencia'
  ) => void;
  showAllParcelas: boolean;
  setShowAllParcelas: Dispatch<SetStateAction<boolean>>;
  daysOfWeek: { value: number; label: string }[];
  formatCurrency: (value: number) => string;
}

/**
 * Form section for "Parcelar".
 * Allows dynamic parcel generation, date picking, and frequency control.
 */
function ParcelarForm(props: ParcelarFormProps) {
  const {
    parcelas,
    setParcelas,
    frequencia,
    setFrequencia,
    parcelasPreview,
    handleParcelaChange,
    handleDateChange,
    showAllParcelas,
    setShowAllParcelas,
    formatCurrency,
  } = props;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">
            Frequência
          </label>
          <Select value={frequencia} onValueChange={(val) => setFrequencia(val as FrequenciaType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="quinzenal">Quinzenal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="bimestral">Bimestral</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">
            Parcelas
          </label>
          <Select
            value={parcelas.toString()}
            onValueChange={(val) => setParcelas(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 100 }).map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {parcelasPreview.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full bg-white border rounded-lg text-sm">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b text-left">Parcela</th>
                <th className="py-3 px-4 border-b text-left">Valor da Parcela</th>
                <th className="py-3 px-4 border-b text-left">Competência</th>
                <th className="py-3 px-4 border-b text-left">Data de Vencimento</th>
              </tr>
            </thead>
            <tbody>
              {parcelasPreview
                .slice(0, showAllParcelas ? parcelasPreview.length : 12)
                .map((parcela, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">
                      <Input
                        type="text"
                        value={formatCurrency(parcela.valor)}
                        onChange={(e) =>
                          handleParcelaChange(index, parseFloat(e.target.value.replace(/\D/g, '')))
                        }
                        className={baseFieldClasses}
                      />
                    </td>
                    <td className="py-3 px-4 border-b">
                      <DatePicker
                        selectedDate={parcela.competencia}
                        onSelect={(date) => handleDateChange(index, date!, 'competencia')}
                      />
                    </td>
                    <td className="py-3 px-4 border-b">
                      <DatePicker
                        selectedDate={parcela.vencimento}
                        onSelect={(date) => handleDateChange(index, date!, 'vencimento')}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {parcelasPreview.length > 12 && !showAllParcelas && (
            <div className="text-center mt-2">
              <Button variant="link" onClick={() => setShowAllParcelas(true)}>
                Ver mais
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface RepetirFormProps {
  quantidadeRepeticoes: number;
  setQuantidadeRepeticoes: Dispatch<SetStateAction<number>>;
  frequencia: FrequenciaType;
  setFrequencia: Dispatch<SetStateAction<FrequenciaType>>;
  parcelasPreview: Parcela[];
  setParcelasPreview: Dispatch<SetStateAction<Parcela[]>>;
  handleParcelaChange: (index: number, newValue: number) => void;
  handleDayOfWeekChange: (index: number, newDayOfWeek: number) => void;
  handleDateChange: (
    index: number,
    selectedDate: Date,
    field: 'vencimento' | 'competencia'
  ) => void;
  showAllParcelas: boolean;
  setShowAllParcelas: Dispatch<SetStateAction<boolean>>;
  daysOfWeek: { value: number; label: string }[];
  formatCurrency: (value: number) => string;
}

/**
 * Form section for "Repetir".
 * Similar structure to ParcelarForm but for repetição logic.
 */
function RepetirForm(props: RepetirFormProps) {
  const {
    quantidadeRepeticoes,
    setQuantidadeRepeticoes,
    frequencia,
    setFrequencia,
    parcelasPreview,
    handleParcelaChange,
    handleDateChange,
    showAllParcelas,
    setShowAllParcelas,
    formatCurrency,
  } = props;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Frequência</label>
          <Select
            value={frequencia}
            onValueChange={(val) => setFrequencia(val as FrequenciaType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="quinzenal">Quinzenal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="bimestral">Bimestral</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Repetições</label>
          <Select
            value={quantidadeRepeticoes.toString()}
            onValueChange={(val) => setQuantidadeRepeticoes(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 100 }).map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {parcelasPreview.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full bg-white border rounded-lg text-sm">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b text-left">Repetição</th>
                <th className="py-3 px-4 border-b text-left">Valor da Repetição</th>
                <th className="py-3 px-4 border-b text-left">Competência</th>
                <th className="py-3 px-4 border-b text-left">Data de Vencimento</th>
              </tr>
            </thead>
            <tbody>
              {parcelasPreview
                .slice(0, showAllParcelas ? parcelasPreview.length : 12)
                .map((parcela, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">
                      <Input
                        type="text"
                        value={formatCurrency(parcela.valor)}
                        onChange={(e) =>
                          handleParcelaChange(index, parseFloat(e.target.value.replace(/\D/g, '')))
                        }
                        className={baseFieldClasses}
                      />
                    </td>
                    <td className="py-3 px-4 border-b">
                      <DatePicker
                        selectedDate={parcela.competencia}
                        onSelect={(date) => handleDateChange(index, date!, 'competencia')}
                      />
                    </td>
                    <td className="py-3 px-4 border-b">
                      <DatePicker
                        selectedDate={parcela.vencimento}
                        onSelect={(date) => handleDateChange(index, date!, 'vencimento')}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {parcelasPreview.length > 12 && !showAllParcelas && (
            <div className="text-center mt-2">
              <Button variant="link" onClick={() => setShowAllParcelas(true)}>
                Ver mais
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface ComboBoxWithAddProps {
  items: string[];
  onAddItem: (newItem: string) => void;
  value: string[];
  onChange: (newValue: string[]) => void;
  multi?: boolean;
  label: string;
  placeholder: string;
}

/**
 * A ComboBox component that supports:
 * - Typing to search/filter
 * - Adding new items if they don't exist
 * - Single or multiple selection
 * 
 * This creates a flexible and scalable input pattern for list-based fields.
 */
function ComboBoxWithAdd({
  items,
  onAddItem,
  value,
  onChange,
  multi = false,
  label,
  placeholder,
}: ComboBoxWithAddProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  );
  const showAddButton = inputValue && !filteredItems.includes(inputValue);

  const toggleSelect = (selectedItem: string) => {
    if (multi) {
      if (value.includes(selectedItem)) {
        onChange(value.filter((v) => v !== selectedItem));
      } else {
        onChange([...value, selectedItem]);
      }
    } else {
      onChange([selectedItem]);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground block">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(baseFieldClasses, "justify-between")}
            onClick={() => setOpen(true)}
          >
            {multi
              ? value.length > 0
                ? value.join(', ')
                : placeholder
              : value.length > 0
              ? value[0]
              : placeholder}
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full">
          <Command>
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              placeholder="Digite para pesquisar..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item, idx) => (
                  <CommandItem
                    key={idx}
                    onSelect={() => toggleSelect(item)}
                    className="cursor-pointer"
                  >
                    {item}
                    {multi && value.includes(item) && (
                      <span className="ml-auto text-blue-600">Selecionado</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {showAddButton && (
                <div
                  className="px-2 py-2 flex items-center cursor-pointer hover:bg-accent"
                  onClick={() => {
                    onAddItem(inputValue);
                    toggleSelect(inputValue);
                    setInputValue('');
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar "{inputValue}"
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ---------------------- MAIN COMPONENT ----------------------

/**
 * The main AddTransactionDialog component.
 * Integrates multiple forms, states, and logic into a cohesive experience.
 *
 * Changes (Improvements) made:
 * - Introduced constants and utility functions for formatting and styling.
 * - Broke down logic into smaller, well-defined components.
 * - Added TypeScript annotations for clarity.
 * - Added comments and docstrings for maintainability and onboarding.
 * - Kept state handling intact, but made the code more readable and scalable.
 * - Ensured styling consistency and code reusability.
 * - Retained all functionality from previous iterations.
 */
export function AddTransactionDialog() {
  const router = useRouter();

  // States for fields
  const [recorrencia, setRecorrencia] = useState<RecorrenciaType>('unico');
  const [dateVencimento, setDateVencimento] = useState<Date>(new Date());
  const [dateCompetencia, setDateCompetencia] = useState<Date>(new Date());
  const [parcelas, setParcelas] = useState<number>(2);
  const [quantidadeRepeticoes, setQuantidadeRepeticoes] = useState<number>(2);
  const [frequencia, setFrequencia] = useState<FrequenciaType>('mensal');

  const [valorBruto, setValorBruto] = useState<number>(0);
  const [desconto, setDesconto] = useState<number>(0);
  const [juros, setJuros] = useState<number>(0);
  const [valorLiquido, setValorLiquido] = useState<number>(0);

  const [parcelasPreview, setParcelasPreview] = useState<Parcela[]>([]);
  const [valorLiquidoInvalido, setValorLiquidoInvalido] = useState<boolean>(false);
  const [showAllParcelas, setShowAllParcelas] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [descricao, setDescricao] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comprovanteDialog, setComprovanteDialog] = useState<File | null>(null);
  const [observacaoDialog, setObservacaoDialog] = useState<string>('');

  // Data lists
  const [fornecedores, setFornecedores] = useState<string[]>(['Fornecedor A', 'Fornecedor B', 'Fornecedor C']);
  const [etiquetas, setEtiquetas] = useState<string[]>(['Etiqueta A', 'Etiqueta B']);
  const [centrosCusto, setCentrosCusto] = useState<string[]>(['Centro 1', 'Centro 2']);
  const [planoContasTodos, setPlanoContasTodos] = useState<string[]>([
    'Plano A',
    'Subplano A1',
    'Subplano A2',
    'Plano B',
    'Subplano B1',
    'Subplano B2',
    'Plano C',
    'Subplano C1',
    'Subplano C2'
  ]);
  const [bancos, setBancos] = useState<string[]>(['Banco 1', 'Banco 2', 'Banco 3']);
  const [statusList, setStatusList] = useState<string[]>(['Pendente', 'Pago', 'Atrasado']);

  const [selectedFornecedor, setSelectedFornecedor] = useState<string[]>([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState<string[]>([]);
  const [selectedCentroCusto, setSelectedCentroCusto] = useState<string[]>([]);
  const [selectedPlanoContas, setSelectedPlanoContas] = useState<string[]>([]);
  const [bankDialog, setBankDialog] = useState<string[]>([]);
  const [statusDialog, setStatusDialog] = useState<string[]>([]);
  const [datePagamentoDialog, setDatePagamentoDialog] = useState<Date>(new Date());

  const daysOfWeek = [
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
  ];

  /** On value change handlers for money fields. Ensures no loss of functionality. */
  const handleValueChange =
    (setValue: Dispatch<SetStateAction<number>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/\D/g, '');
      const numericValue = Number(inputValue);
      setValue(numericValue);
    };

  /** 
   * Compute valorLiquido dynamically based on conditions (valorBruto, juros, desconto).
   * If 'repetir', sum up preview parcels. Keep existing logic. 
   */
  useEffect(() => {
    if (recorrencia !== 'repetir') {
      const valorCalculado = valorBruto + juros - desconto;
      setValorLiquido(valorCalculado);
      setValorLiquidoInvalido(false);
    } else {
      const totalRepeticoes = parcelasPreview.reduce((sum, parcela) => sum + parcela.valor, 0);
      setValorLiquido(totalRepeticoes);
    }
  }, [valorBruto, juros, desconto, recorrencia, parcelasPreview]);

  /**
   * Recalculate parcelasPreview whenever relevant fields change.
   * This preserves the dynamic behavior and ensures no loss of functionality.
   */
  const calcularParcelasOuRepeticoes = useCallback((): Parcela[] => {
    let parcelasOuRepeticoes: Parcela[] = [];
    if (!dateVencimento) return parcelasOuRepeticoes;

    const baseValor =
      recorrencia === 'repetir' ? valorBruto + juros - desconto : valorLiquido;

    switch (recorrencia) {
      case 'unico':
        // No multiple parcelas in unique mode.
        break;
      case 'parcelar':
        parcelasOuRepeticoes = Array.from({ length: parcelas }, (_, i) => {
          const valorParcela = Math.floor(baseValor / parcelas);
          const valorRestante = baseValor - valorParcela * parcelas;
          const valorFinal = i === parcelas - 1 ? valorParcela + valorRestante : valorParcela;
          if (frequencia === 'semanal') {
            return {
              valor: valorFinal,
              dayOfWeek: 1,
              competencia: new Date(),
            };
          } else {
            return {
              valor: valorFinal,
              vencimento: calculateNextDate(dateVencimento, i, frequencia),
              competencia: new Date(),
            };
          }
        });
        break;
      case 'repetir':
        parcelasOuRepeticoes = Array.from({ length: quantidadeRepeticoes }, (_, i) => {
          const valorRepeticao = baseValor;
          const competencia = calculateNextDate(dateCompetencia, i, frequencia);

          if (frequencia === 'semanal') {
            return {
              valor: valorRepeticao,
              dayOfWeek: 1,
              competencia,
            };
          } else if (frequencia === 'quinzenal') {
            const vencimento = calculateNextDate(dateVencimento, i * 2, 'mensal');
            const segundoVencimento = addDays(vencimento, 15);
            return {
              valor: valorRepeticao,
              vencimento,
              segundaData: segundoVencimento,
              competencia,
            };
          } else {
            return {
              valor: valorRepeticao,
              vencimento: calculateNextDate(dateVencimento, i, frequencia),
              competencia,
            };
          }
        });
        break;
      default:
        break;
    }

    return parcelasOuRepeticoes;
  }, [
    dateVencimento,
    dateCompetencia,
    parcelas,
    recorrencia,
    frequencia,
    quantidadeRepeticoes,
    valorBruto,
    juros,
    desconto,
    valorLiquido
  ]);

  useEffect(() => {
    setParcelasPreview(calcularParcelasOuRepeticoes());
    setShowAllParcelas(false);
  }, [
    calcularParcelasOuRepeticoes,
    dateVencimento,
    dateCompetencia,
    parcelas,
    recorrencia,
    frequencia,
    quantidadeRepeticoes,
    valorBruto,
    juros,
    desconto,
    valorLiquido,
  ]);

  /** Validate valorLiquido as previously done. */
  const handleValorLiquidoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    const numericValue = Number(inputValue);
    const valorCalculado = valorBruto + juros - desconto;
    setValorLiquidoInvalido(numericValue !== valorCalculado);
    setValorLiquido(numericValue);
  };

  /** Handles dynamic parcela changes. Maintains original logic. */
  const handleParcelaChange = (index: number, newValue: number) => {
    setParcelasPreview((prev) => {
      const updated = [...prev];
      updated[index].valor = newValue;
      if (recorrencia === 'parcelar') {
        const totalAnterior = updated.slice(0, index + 1).reduce((sum, p) => sum + p.valor, 0);
        const valorRestante = valorLiquido - totalAnterior;
        const parcelasRestantes = updated.length - (index + 1);
        if (parcelasRestantes > 0) {
          const valorParcelaRestante = Math.floor(valorRestante / parcelasRestantes);
          const valorRestanteUltimaParcela =
            valorRestante - valorParcelaRestante * parcelasRestantes;
          for (let i = index + 1; i < updated.length; i++) {
            updated[i].valor =
              i === updated.length - 1
                ? valorParcelaRestante + valorRestanteUltimaParcela
                : valorParcelaRestante;
          }
        }
      } else if (recorrencia === 'repetir') {
        const totalRepeticoes = updated.reduce((sum, p) => sum + p.valor, 0);
        setValorLiquido(totalRepeticoes);
      }
      return updated;
    });
  };

  const handleDayOfWeekChange = (index: number, newDayOfWeek: number) => {
    setParcelasPreview((prev) => {
      const updated = [...prev];
      updated[index].dayOfWeek = newDayOfWeek;
      return updated;
    });
  };

  const handleDateChange = useCallback(
    (index: number, selectedDate: Date, field: 'vencimento' | 'competencia') => {
      setParcelasPreview((prev) => {
        const updated = [...prev];
        updated[index][field] = selectedDate;
        // Quinzena logic stays
        if (frequencia === 'quinzenal' && field === 'vencimento') {
          updated[index].segundaData = addDays(selectedDate, 15);
        }
        if (recorrencia === 'parcelar') {
          if (field === 'vencimento') {
            for (let i = index + 1; i < updated.length; i++) {
              const increment = i - index;
              updated[i].vencimento = calculateNextDate(selectedDate, increment, frequencia);
              if (frequencia === 'quinzenal') {
                updated[i].segundaData = addDays(updated[i].vencimento!, 15);
              }
            }
          } else if (field === 'competencia') {
            // Competencia cascades to next
            for (let i = index + 1; i < updated.length; i++) {
              updated[i].competencia = selectedDate;
            }
          }
        }
        return updated;
      });
    },
    [frequencia, recorrencia]
  );

  const handleComprovanteDialogChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setComprovanteDialog(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valorLiquidoInvalido) {
      console.log('Formulário válido, pode prosseguir.');
    } else {
      setErrorMessage('O valor final não bate com o cálculo padrão. Verifique os valores inseridos.');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Adicionar Transação</Button>
      </SheetTrigger>
      <SheetContent position="right" className="overflow-auto p-6 w-[40%] min-w-[600px] max-w-none">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="numero-documento" className="block mb-2 text-sm font-medium text-foreground">
              Número do Documento
            </label>
            <Input id="numero-documento" className={baseFieldClasses} />
          </div>

          <ComboBoxWithAdd
            label="Fornecedor"
            placeholder="Selecionar"
            items={fornecedores}
            onAddItem={(newItem) => setFornecedores((prev) => [...prev, newItem])}
            value={selectedFornecedor}
            onChange={setSelectedFornecedor}
          />

          <div>
            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-foreground">
              Descrição
            </label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={cn(baseFieldClasses, "h-auto")}
            />
          </div>

          <ComboBoxWithAdd
            label="Etiqueta"
            placeholder="Selecionar"
            items={etiquetas}
            onAddItem={(newItem) => setEtiquetas((prev) => [...prev, newItem])}
            value={selectedEtiquetas}
            onChange={setSelectedEtiquetas}
            multi
          />

          <ComboBoxWithAdd
            label="Centro de Custo"
            placeholder="Selecionar"
            items={centrosCusto}
            onAddItem={(newItem) => setCentrosCusto((prev) => [...prev, newItem])}
            value={selectedCentroCusto}
            onChange={setSelectedCentroCusto}
          />

          <div>
            <label htmlFor="gross-value" className="block mb-2 text-sm font-medium text-foreground">
              Valor Original
            </label>
            <Input
              type="text"
              id="gross-value"
              value={formatCurrency(valorBruto)}
              onChange={handleValueChange(setValorBruto)}
              className={baseFieldClasses}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <DatePicker
                label="Data de Vencimento"
                selectedDate={dateVencimento}
                onSelect={setDateVencimento}
              />
            </div>
            <div className="flex-1">
              <DatePicker
                label="Data de Competência"
                selectedDate={dateCompetencia}
                onSelect={setDateCompetencia}
              />
            </div>
          </div>

          <div className="border-t my-4"></div>

          <ComboBoxWithAdd
            label="Plano de Contas / SubPlano"
            placeholder="Selecionar"
            items={planoContasTodos}
            onAddItem={(newItem) => setPlanoContasTodos((prev) => [...prev, newItem])}
            value={selectedPlanoContas}
            onChange={setSelectedPlanoContas}
          />

          <div>
            <label htmlFor="observation" className="block mb-2 text-sm font-medium text-foreground">
              Observação
            </label>
            <Textarea id="observation" className={cn(baseFieldClasses, "h-auto")} />
          </div>

          {errorMessage && (
            <div className="text-red-500 font-bold mb-4">{errorMessage}</div>
          )}

          <div className="flex justify-end space-x-3">
            <Button type="submit">Salvar</Button>

            <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">Marcar como pago</Button>
              </SheetTrigger>
              <SheetContent position="right" className="overflow-auto p-6 w-[60%] min-w-[600px] max-w-none">
                <SheetHeader>
                  <SheetTitle>Marcar como pago</SheetTitle>
                  <SheetDescription>
                    Preencha as informações abaixo para marcar como pago.
                  </SheetDescription>
                </SheetHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDialogOpen(false);
                  }}
                  className="space-y-4 mt-4"
                >
                  <div>
                    <label htmlFor="gross-value-dialog" className="block mb-2 text-sm font-medium text-foreground">
                      Valor Original
                    </label>
                    <Input
                      type="text"
                      id="gross-value-dialog"
                      value={formatCurrency(valorBruto)}
                      readOnly
                      className={baseFieldClasses}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="desconto-dialog" className="block mb-2 text-sm font-medium text-foreground">
                        Desconto
                      </label>
                      <Input
                        type="text"
                        id="desconto-dialog"
                        value={formatCurrency(desconto)}
                        onChange={handleValueChange(setDesconto)}
                        className={baseFieldClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="interest-value-dialog" className="block mb-2 text-sm font-medium text-foreground">
                        Juros
                      </label>
                      <Input
                        type="text"
                        id="interest-value-dialog"
                        value={formatCurrency(juros)}
                        onChange={handleValueChange(setJuros)}
                        className={baseFieldClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="liquid-value-dialog" className="block mb-2 text-sm font-medium text-foreground">
                        Valor Final
                      </label>
                      <Input
                        type="text"
                        id="liquid-value-dialog"
                        value={formatCurrency(valorLiquido)}
                        onChange={handleValorLiquidoChange}
                        className={cn(baseFieldClasses, valorLiquidoInvalido ? 'border-red-500' : '')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Recorrência</label>
                    <Select
                      value={recorrencia}
                      onValueChange={(val) => setRecorrencia(val as RecorrenciaType)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unico">Pagamento Único</SelectItem>
                        <SelectItem value="parcelar">Parcelar</SelectItem>
                        <SelectItem value="repetir">Repetir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {recorrencia === 'unico' && (
                    <UnicoForm
                      dateVencimento={dateVencimento}
                      setDateVencimento={setDateVencimento}
                      dateCompetencia={dateCompetencia}
                      setDateCompetencia={setDateCompetencia}
                    />
                  )}
                  {recorrencia === 'parcelar' && (
                    <ParcelarForm
                      parcelas={parcelas}
                      setParcelas={setParcelas}
                      frequencia={frequencia}
                      setFrequencia={setFrequencia}
                      parcelasPreview={parcelasPreview}
                      setParcelasPreview={setParcelasPreview}
                      handleParcelaChange={handleParcelaChange}
                      handleDayOfWeekChange={handleDayOfWeekChange}
                      handleDateChange={handleDateChange}
                      showAllParcelas={showAllParcelas}
                      setShowAllParcelas={setShowAllParcelas}
                      daysOfWeek={daysOfWeek}
                      formatCurrency={formatCurrency}
                    />
                  )}
                  {recorrencia === 'repetir' && (
                    <RepetirForm
                      quantidadeRepeticoes={quantidadeRepeticoes}
                      setQuantidadeRepeticoes={setQuantidadeRepeticoes}
                      frequencia={frequencia}
                      setFrequencia={setFrequencia}
                      parcelasPreview={parcelasPreview}
                      setParcelasPreview={setParcelasPreview}
                      handleParcelaChange={handleParcelaChange}
                      handleDayOfWeekChange={handleDayOfWeekChange}
                      handleDateChange={handleDateChange}
                      showAllParcelas={showAllParcelas}
                      setShowAllParcelas={setShowAllParcelas}
                      daysOfWeek={daysOfWeek}
                      formatCurrency={formatCurrency}
                    />
                  )}

                  <ComboBoxWithAdd
                    label="Banco"
                    placeholder="Selecionar"
                    items={bancos}
                    onAddItem={(newItem) => setBancos((prev) => [...prev, newItem])}
                    value={bankDialog}
                    onChange={setBankDialog}
                  />

                  <ComboBoxWithAdd
                    label="Status"
                    placeholder="Selecionar"
                    items={statusList}
                    onAddItem={(newItem) => setStatusList((prev) => [...prev, newItem])}
                    value={statusDialog}
                    onChange={setStatusDialog}
                  />

                  <div>
                    <DatePicker
                      label="Data de Recebimento"
                      selectedDate={datePagamentoDialog}
                      onSelect={setDatePagamentoDialog}
                    />
                  </div>
                  <div>
                    <label htmlFor="comprovante-dialog" className="block mb-2 text-sm font-medium text-foreground">
                      Anexar Comprovante
                    </label>
                    <Input
                      type="file"
                      id="comprovante-dialog"
                      onChange={handleComprovanteDialogChange}
                      className={baseFieldClasses}
                    />
                    {comprovanteDialog && (
                      <p className="mt-2 text-sm text-gray-600">
                        Arquivo selecionado: {comprovanteDialog.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="observacao-dialog" className="block mb-2 text-sm font-medium text-foreground">
                      Observação
                    </label>
                    <Textarea
                      id="observacao-dialog"
                      className={cn(baseFieldClasses, "h-auto")}
                      value={observacaoDialog}
                      onChange={(e) => setObservacaoDialog(e.target.value)}
                    />
                  </div>
                  <SheetFooter>
                    <Button type="submit">Confirmar</Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>

            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push('/settings');
              }}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}