angular.module("contatooh").controller("ContatosController", function($scope, Contato) {
  $scope.contatos = [];

  $scope.filtro = "";

  $scope.mensagem = {texto: ""};

  // Método GET do $http utilizando o padrão de Promisses
  // $http.get("/contatos")
  //   .success(function(data) {
  //     $scope.contatos = data;
  //   })
  //   .error(function(statusText) {
  //     console.log("Não foi possível obter a lista de contatos.");
  //     console.log(statusText);
  //   });

  function buscaContatos() {
    Contato.query(
      function(contatos) {
        $scope.contatos = contatos;
      },
      function(erro) {
        console.log(erro);
        $scope.mensagem = {
          texto: "Não foi possível obter a lista de contatos."
        };
      }
    );
  }

  // Criando a função $scope.init para chamar todas as funções que devem ser inicializadas com o Controller
  $scope.init = function() {
    buscaContatos();
  };

  // Chamando a função de inicialização do Controller
  $scope.init()

  // Função de remoção do contato
  $scope.remove = function(contato) {
    Contato.delete({id: contato._id},
      buscaContatos,
      function(erro) {
        $scope.mensagem = {
          texto: "Não foi possível remover o contato."
        };
        console.log(erro);
      });
  };
});
