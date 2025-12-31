import { useCallback } from 'react'
import { DialogBoxLayoutType } from '@constants/index'



export const useShowGenericWarning = () => {


  const showGenericWarning = useCallback(
    (
      onClick?: (() => void) | undefined,
      message?: string,
      layout?: DialogBoxLayoutType,

    ) =>
     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
     {message??layout},[]
  )

  return showGenericWarning
}
