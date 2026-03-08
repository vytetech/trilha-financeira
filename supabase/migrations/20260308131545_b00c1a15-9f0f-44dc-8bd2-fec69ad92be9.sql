ALTER TABLE public.transactions 
  ADD COLUMN installment_count integer DEFAULT 1,
  ADD COLUMN installment_number integer DEFAULT 1;