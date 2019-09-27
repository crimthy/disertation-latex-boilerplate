
const processString = (value) => {
    return value
}

const processNumber = (value) => {
    return value
}

const processArray = (value) => {
    return value.join(',')
}

const processObject = (value) => {
    return Object.keys(value).reduce((accumulator, currentValue) => accumulator + `${currentValue}:${value[currentValue]}; `, '');
}

const typeToProcessorDefaultMap = {
    "Number" : processNumber,
    "String" : processNumber,
    "Array": processArray,
    "Object": processObject
}

class TemplateEngine {
    constructor(build){
        this.file = build.file
        
        // concat array ??
        this.processorsMap = build.processorsMap
    }

    static get Builder() {
        class Builder {
           constructor(file) {
              this.file = file
              this.processorsMap = {}
              this.useDefaultProcessors = true
           }
           // change later
           withTypeProcessorsMap(processorsMap) {
              this.processorsMap = processorsMap
              return this
           }

           withCustomTypeProcessor(type, processor) {
               this.processorsMap[type] = processor
           }

           disableDefaultProcessors() {
               this.useDefaultProcessors = false
           }
           build() {
              return new TemplateEngine(this)
           }
        }
        return Builder
     }
}