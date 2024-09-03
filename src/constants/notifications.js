import React from 'react';

const no_variable_duplicated = {
    title: 'Ops... há campos duplicados no cabeçalho',
    message: 'Remova os campos duplicados e tente novamente.'
};

const no_variable_underline = {
    title: 'Ops... há campos incorretos no cabeçalho',
    message:
        'Os campos do cabeçalho não devem conter espaços ou símbolos, ex: "_".'
};

const required_fields = {
    title: 'Ops... há campos com erro',
    message: 'Confira os campos preenchidos e tente novamente.'
};

const file_format = {
    title: 'Ops... formato de arquivo não suportado',
    message: 'Por favor, utilize um arquivo .CSV'
};

const medium_number_quality = {
    title: 'A qualidade do seu número está média',
    message: (
        <>
            <b>Atenção!</b> Tem certeza de que deseja enviar mensagens ativas?
            Isso pode piorar a qualidade do seu número no WhatsApp.
        </>
    ),
    cancel: 'Não, cancelar',
    confirm: 'Sim, continuar'
};

const low_number_quality = {
    title: 'A qualidade do seu número está baixa',
    message: (
        <>
            <b>Atenção!</b> Tem certeza de que deseja enviar mensagens ativas?
            Seu número pode ser banido do WhatsApp.
        </>
    ),
    cancel: 'Não, cancelar',
    confirm: 'Sim, continuar'
};

const variables_quantity = {
    title: 'Seu modelo tem mais variáveis que sua planilha',
    message:
        'Quer mesmo continuar? Sua mensagem pode aparecer de forma estranha para seus contatos.',
    cancel: 'Não, cancelar',
    confirm: 'Sim, continuar'
};

const variables_value = {
    title: 'Você não preencheu os valores das variáveis',
    message:
        'Quer mesmo continuar? Sua mensagem pode aparecer de forma estranha para seus contatos.',
    cancel: 'Não, cancelar',
    confirm: 'Sim, continuar'
};

const response_targeting = {
    title: 'Você não criou um direcionamento de resposta',
    message:
        'Tem certeza de que não deseja personalizar o direcionamento de resposta? Seu contato será direcionado para o fluxo inicial do seu chatbot.',
    cancel: 'Cancelar',
    confirm: 'Sim, continuar'
};

const submit_success = 'Notificação encaminhada com sucesso.';

const submit_error = 'Erro ao enviar notificação.';

export {
    no_variable_duplicated,
    no_variable_underline,
    required_fields,
    file_format,
    medium_number_quality,
    low_number_quality,
    variables_quantity,
    variables_value,
    response_targeting,
    submit_success,
    submit_error
};
