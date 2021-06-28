import router from './router';

const onSuccess = () => {
  router.push('/login');
}

const handleError = () => {
  router.push('/error');
}

router.onReady(onSuccess, handleError);

router.onError(()=>{
  console.error("Unknown error");
});
