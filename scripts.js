let last_clipboard = ""
let last_output = ""
let anagram_config = {}
const term = $('body').terminal(function(input) {
    if(input === "") return
    if(input === "config") return sendConfig.bind(this)()
    mixText(input)
}, {
    greetings: 'ANAGRAMMES\n' +
        'Tapez "config" pour la configuration ou entrez du texte pour en faire un anagramme'
})
function onfucus(){
    if(anagram_config.autoPaste){
        navigator.clipboard.readText()
            .then(text => {
                if(text === last_clipboard || text === last_output) return
                last_clipboard = text
                term.echo(">" + text)
                term.echo("Utilisation automatique depuis le presse papier\n")
                mixText(text)
            })
            .catch(() => {
                term.error("Impossible d'accéder au presse papier")
            })
    }
}
function sendConfig(){
    this.echo(genConfigButton("autoCopy", "Copier le texte après la génération"))
    this.echo(genConfigButton("autoPaste", "Utiliser automatiquement le texte contenu dans votre presse papier"))
}
function handleChange(elem, property){
    anagram_config[property] = elem.checked
}
function genConfigButton(property, description){
    return $(`<input onchange="handleChange(this, '${property}')" type='checkbox' ${anagram_config[property]? "checked" : ""}><p class='info'>${description}</p>`)
}
function mixText(input){
    input = input.toLowerCase()
    const mixed = input.split('').sort(function(){return 0.5-Math.random()}).join('')
    let same = 0
    for (let i = 0; i < input.length; i++) {
        if(mixed[i] === input[i]) same += 1
    }
    same = same / input.length * 100
    term.echo(mixed + "\n\n" + `Taux de mélange :${Math.round(100 - same)}%`)
    last_output = mixed
    if(anagram_config.autoCopy){
        navigator.clipboard.writeText(mixed)
        term.echo("Texte copié dans le presse papier!")
    }
    term.echo("\n")
}