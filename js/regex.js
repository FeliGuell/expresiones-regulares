function exec(event) {
  event.preventDefault();

  clearResults();
  let valores = handleValues();

  let resultados = execRegex(valores);

  resultadosInput(resultados);
  highlightResultados(resultados, valores.target);
}

function execRegex(valores) {
  let textoPattern = valores.pattern; //dateFormat();
  let textoTarget = valores.target;
  let mostrarIndex = valores.mostrarIndex;
  let mostrarGrupos = valores.mostrarGrupos;

  let resultados = [];
  let resultado = null;

  let objetoRegex = new RegExp(textoPattern, 'g');               //Nueva instancia que recibe un texto y que va a buscar en todo el texto ('g' de global)

  while ((resultado = objetoRegex.exec(textoTarget))) {
    if (resultado[0] === '') {
      throw Error('Regex retorno un valor vacio.');
    }

    console.log('Resultado: ' + resultado[0]);

    resultados.push(
      result(
        mostrarGrupos ? resultado.join(' ||| ') : resultado[0],
        resultado.index,
        objetoRegex.lastIndex,
        mostrarIndex
      )
    );
  }

  timeExec(textoPattern, textoTarget);

  return resultados;
}

function result(resultado, index, lastIndex, mostrarIndex) {
  let textoIndex = mostrarIndex ? ' [' + index + '-' + lastIndex + ']' : '';

  return {
    resultado: resultado + textoIndex,
    index: index,
    lastIndex: lastIndex,
  };
}

function timeExec(textoPattern, textoTarget) {
  let pObjetoRegex = new RegExp(textoPattern, 'g');
  let ini = performance.now();
  pObjetoRegex.test(textoTarget);
  let fim = performance.now();
  console.log('Tiempo de ejecución (ms) ' + (fim - ini));
}

function resultadosInput(resultados) {
  let inputResultado = document.querySelector('#resultado');
  let labelResultado = document.querySelector('#labelResultados');

  labelResultado.innerHTML = resultados.length + ' Matches (resultados)';

  let resultadosComoArray = resultados.map(function (item) {
    return item.resultado;
  });

  labelResultado.innerHTML =
    resultadosComoArray.length + ' Matches (resultados)';

  if (resultadosComoArray.length > 0) {
    inputResultado.value = resultadosComoArray.join(' | ');
    inputResultado.style.borderStyle = 'solid';
    inputResultado.style.borderColor = 'lime'; //verde
  } else {
    inputResultado.placeholder = 'Sin resultados';
    inputResultado.value = '';
    inputResultado.style.borderStyle = 'solid';
    inputResultado.style.borderColor = 'red';
  }
}

function highlightResultados(resultados, texto) {
  let item = null;
  let indexBegin = 0;
  let conteudo = '';

  while ((item = resultados.shift()) != null) {
    conteudo += sinHighlight(
      escapeHtml(texto.substring(indexBegin, item.index))
    );
    conteudo += conHighlight(
      escapeHtml(texto.substring(item.index, item.lastIndex))
    );
    indexBegin = item.lastIndex;
  }

  //¿Quedó algún texto?
  if (texto.length - indexBegin > 0) {
    conteudo += sinHighlight(
      escapeHtml(texto.substring(indexBegin, texto.length))
    );
  }

  document.querySelector('#highlightText').innerHTML = conteudo;
}

function sinHighlight(texto) {
  return texto;
  //return "<s>" + texto + "</s>";
}

function conHighlight(texto) {
  return "<span class='bg-primary'>" + texto + '</span>';
}

function escapeHtml(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function handleValues() {
  let inputTarget = document.querySelector('#target');
  let inputPattern = document.querySelector('#pattern');
  inputPattern.focus();

  let checkboxIndex = document.querySelector('#mostrarIndex');
  let checkboxGroups = document.querySelector('#mostrarGrupos');

  _verificarInputs(inputTarget, inputPattern);

  console.log('Target:  ' + inputTarget.value);
  console.log('Pattern: ' + inputPattern.value.trim());

  return {
    target: inputTarget.value.trim(),
    pattern: inputPattern.value,
    mostrarIndex: checkboxIndex.checked,
    mostrarGrupos: checkboxGroups.checked,
  };
}

function _verificarInputs(inputTarget, inputPattern) {
  if (!inputTarget.value) {
    inputTarget.placeholder = 'Ingresa un target';
  }

  if (!inputPattern.value) {
    inputPattern.placeholder = 'Ingresa un pattern';
  }

  if (!inputTarget.value || !inputPattern.value) {
    throw Error('Valores inválidos');
  }
}

function clearResults() {
  console.clear();
  document.querySelector('#labelResultados').innerHTML =
    '0 Matches (resultados)';
  document.querySelector('#resultado').value = '';
  document.querySelector('#resultado').placeholder = 'No hay ningún resultado';
  document.querySelector('#highlightText').innerHTML =
    '<em>No hay ningún resultado</em>';
}

function dateFormat() {
  let DIA = '[0123]?\\d';
  let _DE_ = '\\s+(de )?\\s*';
  let MES = '[A-Za-z][a-z]{3,8}';
  let ANIO = '[12]\\d{3}';
  return DIA + _DE_ + MES + _DE_ + ANIO;
}


/*
--------------Quantifiers---------
? = Cero o una vez
+ = Una o más veces
* = 0 o más veces
{n} = Exactamente n veces
{n,} = Al menos n veces
{n,m} = Al menos n veces y maximo m veces

--------------Clases de char--------------
[A-Z] = letras desde la A hasta la Z
[1,2,3] = 1, 2 o 3
\d = todos los digitos[0-9]
\s = espacios en blanco
\w = wordchar[A-Za-z0-9_]


--------------Anclas---------------

\b = word boundary, no reconoce los wordchar 
^ = indica el ancla de inicio
$ = indica el ancla final

--------------


EJ: 
IP = 192.185.2.145
regEx = \d{1,3}[-.]?\d{1,3}\.\d{1,3}\.\d{1,3}


\d = digitos de 0 a 9
{1,3} = Pueden ser de 1 a 3 digitos
[-.] = Puede ser un guion o un punto
? = Puede existir o no

-------------

EJ: 
fecha = 10 de Enero de 1994
regEx = [1-3]\d\s+de\s+[A-Z][a-z]{3,9}\s+de\s+[12]\d{3}


[1-3]= 1 a 3 digitos
\s+ = Pueden haber 1 a N veces cantidad de espacios en blanco
[A-Z] = Todas las letras mayusculas
[a-z] = Todas las letras minusculas
[a-zñç] = Todas las letras minusculas incluida la ñ y la ç
[12]\d{3} = Puede comenzar con 1 o 2 y tiene en total 4 digitos


-------------

Gilberto es un profesor de física en un colegio en el cual la calificación para aprobar es 8. 
Entretanto, este profesor es muy amigo de los alumnos y tiene la costumbre de aprobar a los alumnos con calificación 7.2 a 7.9.

EJ:
alumnos = 9.8 - Roberto, 7.1 - Teresa, 4.5 - Armando, 6.5 - Zaira, 7.7 - Stefania, 7.8 - Juan, 5.0 - Romeo, 7.2 - Pedro, 3.1 - Reinaldo, 7.3 - Berenice, 4.7 - Iñaki 
regEx = 7\.[2-9]\s+-\s+[^,]+

7\. = Queremos agarrar a todos los alumnos que empiezan con la calificación 7.
7\.[2-9] = Necesitamos aceptar solamente un número de 2 a 9
7\.[2-9]\s+-\s+ = Sabemos que después del número tenemos un espacio en blanco y un guión seguido de otro espacio en blanco
7\.[2-9]\s+-\s+[^,]+ =  Después del guión queremos obtener cualquier cantidad de caracteres que estén antes de la coma, por eso usaremos [^,]+ que encuentra cualquier dígito que no sea una coma, sea letra o número



-------------

Escriba una expresión regular que haga match solamente con las palabras CABELLO BELLA CAMELLO.

palabras = BESOS CABELLO BELLA PESOS CAMELLO
regEx = [A-Z]*ELL[A-Z]+

[A-Z] = porque queremos encontrar solamente con todas las letras en mayúsculas.
[A-Z]* = usamos el quantifier * que indica cero o más veces



------------

Cuando definimos una clase, la gran mayoría de los meta chars son interpretados como caracteres literales o sea, ya no son meta chars.

EJ: 
string = a+a+
regEx = [a+]+

EJ: 
string = ?clases+poderosas*
regEx= [a-z?*+]+

Todos los caracteres están dentro de [ ]

---------------

Para definir la expresión de la fecha:
EJ: 
regEx = [0123]?\d\s+de\s+[A-Z][a-zç]{1,8}\s+de\s+[12]\d{3}

Una manera fácil de mejorar la legibilidad sería usar algunas variables auxiliares
var DIA  = "[0123]?\d"; 
var _DE_ = "\s+de\s+";
var MES  = "[A-Za-z][a-zç]{1,8}";
var AÑO  = "[12]\d{3}"; 

Después de eso es solamente concatenar las dos variables para tener la expresión final:
var stringRegex = DIA + _DE_ +  MES + _DE_ + AÑO;

Pasamos esa string para la regex engine de JavaScript
var objetoRegex  = new RegExp(stringRegex, 'g');


---------------

¿Qué código postal encontrará la regex abajo?

regEx = ^\d{3}-\d{2}$
codigo postal = 111-11


----------------

¿Cuál de las regex abajo capturaría exactamente las string de fecha que siguen el modelo *Fecha: dia/mes/año* o *Fecha:dia/mes/año*?
regEx = ^Fecha:[\s]?[0-9]{2}\/[0-9]{2}\/[0-9]{4}$


La regex para agarrar la fecha es muy simple, ustedes ya la conocen [0-9]{2}\/[0-9]{2}\/[0-9]{4}. 
Pero también queremos la expresión Fecha: y un espacio en blanco (por ejemplo: \s) entre ellos, que es opcional, o sea, tenemos que utilizar el signo de interrogación (?). 
Además, queremos exactamente esa string, por eso necesitamos poner 
las anclas (^) y ($) al principio y al final de la string, respectivamente: ^Fecha:[\s]?[0-9]{2}\/[0-9]{2}\/[0-9]{4}$


------------------

non-word-boundary: \B (B mayúscula)
EJ:
String:español proporcional compor
Pattern: \Bpor\B

Nuestra regex selecciona la sílaba por, y antes y después de ella debe de haber un Non-word-boundary. 
En otras palabras, la sílaba por debe aparecer dentro de una palabra, nunca al principio o al fin.
Va a encontrar entonces el por dentro de la palabra proporcional


----------------

Al trabajar con fechas, es muy común visualizarlas en diversos formatos, como, por ejemplo, 20 de mayo de 2015 o 20 mayo 2015.
Para nuestro sistema, la preposición de no tiene mucho sentido para el usuario y, por eso, podemos ignorarla. 
Sabemos que podemos pedir al Regex Engine para que no regrese ningún grupo específico a través de non-capturing groups.

Lo que queremos es pedir al Regex Engine para que no nos regrese el grupo formado por de y por un whitespace (\s).

regEx= (?:de\s+)?

Cuidado para no confundir non-capturing groups con los quantifier. Ambos utilizan el mismo simbolo (?), entretanto poseen objetivos diferentes. 
Recordando:

Non-Capturing group - (?:de\s+) (no debe regresarnos el grupo formado por la preposición de y por un \s).
Quantifier - [a-z]? (la clases debe ocurrir cero oo una vez).


----------------
Una tarea común es analizar y verificar los archivos de log para descubrir los posibles problemas en el sistema:

EJ: Caused by: com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure

Queremos usar una Regex que pueda encontrar esa línea y separarla en dos grupos, Causa y Descripción para simplificar la lectura:

_Causa: Caused by: com.mysql.jdbc.exceptions.jdbc4.CommunicationsException
_Descripción:Communications link failure


Primeramente podemos hacer una regex para la string completa:
regEx= Caused[\s\w:.]+:[\w\s]+

Ahora, necesitamos hacer los dos grupos separados:
regEx = (Caused[\s\w:.]+):([\w\s]+)

----------------

Tu tarea es crear una regex que verifica el correo de los usuarios y extraer su nombre.
El correo debe de tener un @ y terminar com alura.com o caelum.com. 
El nombre de usuario (todo antes del @) contiene apenas letras en minúsculas, puede tener un numero al final y tiene de 5 a 15 caracteres.

Por ejemplo:

_super.mario@caelum.com extrae super.mario
_donkey.kong@alura.com extrae donkey.kong
_bowser1@alura.com extrae bowser1


regEx = ([a-z.]{4,14}[a-z\d])@(?:caelum.com|alura.com)

-----------------

Necesitamos ayudar al equipo de desarrollo de Alura una vez más, pero ahora para validar cualquier correo.

Sigue algunos correos que debes de encontrar con la regex:
_donkey.kong@kart.com.br
_bowser1@games.info 
_super-mario@nintendo.JP
_TEAM.donkey-kong@MARIO.kart1.nintendo.com

Y algunos que no:
_toad@kart...com
_wario@kart@nintendo.com
_yoshi@nintendo
_daisy@nintendo.b
_..@email.com


Sigue una posible regex (y bien compleja):
regEx = ^([\w-]\.?)+@([\w-]+\.)+([A-Za-z]{2,4})+$ 

^([\w-]\.?)+ = Definimos una clase con word chars y guión, seguido por un punto opcional:[\w-]\.?
([\w-]+\.)+  = que es muy parecido con lo que viene antes del @, pero el . es obligatorio
([A-Za-z]{2,4})+$  =que está al final, selecciona el dominio del correo, como mx, com, br. Lo mínimo de letras en esta parte deben de ser 2 y máximo 4.


-----------------

Necesitamos ayudar a una empresa de entregas a realizar correctamente la entrega de sus paquetes.
Para eso, nos han disponibilizado un archivo con diversas líneas, 
en las cuales son necesarias las informaciones: Nombre, Calle, Número y Código Postal.

_Diego Bustamante|14/05/1977|Calle Paseo de La Reforma|50|06600|Ciudad de México
_Miguel Herrera|14/06/1993|Calle Temístocles|120|11560|Ciudad de México
_Giovanni Chavez|01/01/1995|Calle Lago Mayor|01|11550|Ciudad de México

Nombre: es necesario entonces creamos un grupo así ([\w\s]+)\|
Fecha de Nacimiento: no es necesario, por eso lo dejaremos como non-capturing group (?:\d\d\/\d\d\/\d\d\d\d)\|
Calle: es necesario, entonces vamos a crear otro grupo ([\w\s]+)\|
Número: es necesario (\d{1,4})\|
Código Postal: también es necesario, podemos crear un grupo de la siguiente manera: (\d{5}-\d{3})\|
Ciudad: no es necesario, entonces agregamos ?: para que su grupo sea non-capturing group (?:[\w\s]{10,})

regEx = ^([\w\s]+)\|(?:\d\d\/\d\d\/\d\d\d\d)\|([\w\s]+)\|(\d{1,4})\|(\d{5}-\d{3})\|(?:[\w\s]{10,})$
*/
