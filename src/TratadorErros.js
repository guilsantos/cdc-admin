import PubSub from 'pubsub-js';

export default class TratadorErros {
    publicaErros(retorno){
        retorno.errors.forEach(error => {
            PubSub.publish("erro-validacao", error);
        });
    }
    limpaErros(){
        PubSub.publish("limpa-erros");
    }
}