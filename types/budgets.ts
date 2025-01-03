export type budgetsType = Array<budgetType>

export type budgetType = {
  id: number,
  created_at: Date,
  created_by: string,
  category_id: number,
  amount: number,
  current_amount: number
}