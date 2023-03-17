import { PropsWithChildren } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuid } from "uuid";

import { ToastProps } from '@/hooks/toast/useLoadingToast';

import { SuccessToast } from '@/components/Toast';

type SuccessToastProps = PropsWithChildren<ToastProps> 

export function useSuccessToast({
  position,
  duration,
  children
}: SuccessToastProps) { 
  const fireToast = () => {
    const id = uuid();
    const dismiss = () => toast.dismiss(id)
    toast.custom((t) => (
      <SuccessToast isVisible={t.visible} onDismiss={dismiss}>
        {children}
      </SuccessToast>
    ), { id, duration, position })
  }
  return fireToast
}

export function useDefaultSuccessToast({
  children
}:{
  children: SuccessToastProps["children"]
}){
  return useSuccessToast({
    children,
    position: "top-right",
    duration: 7000 // 7 sec
  })
}