import router from './router';

const onSuccess = () => {
  router.push('/login');
}

const handleError = () => {
  router.push('/error');
}

router.isReady().then(onSuccess).catch(handleError);

router.onError(()=>{
  console.error("Unknown error");
});
