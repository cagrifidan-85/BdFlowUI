import { useState } from 'react';

export const useGetResultContext = () => {
  const [isOpenSnackBar, setIsOpenSnackBar] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');


  const setResultContent = (success: boolean, msg: string, isOpen: boolean) => {
    setIsSuccess(success);
    setMessage(msg);
    setIsOpenSnackBar(isOpen);
  }

  const closeSnackbar = () => {
    setIsOpenSnackBar(false);
    setTimeout(() => {
      setMessage('');
    }, 300); // Wait for animation to complete
  };

  return {
    isOpenSnackBar,
    isSuccess,
    message,
    setResultContent,
    closeSnackbar,
  };
};
