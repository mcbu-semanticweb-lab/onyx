export default function (text) {
    if(text.includes('#'))
        return text.split('#')[1];
    else if(text.includes('/')){
        let textone = text.split('/')[text.split('/').length-1];
        if(textone.length===0)
            return text;
        return text.split('/')[text.split('/').length-1];
    }
    else
        return text;
}