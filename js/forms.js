function sendForm( f_formId ) {
    const form = document.getElementById( f_formId )
    event.preventDefault()

    const CheckFormClass = new CheckForm( form )

    if( CheckFormClass.checkFormFields() === true ) {
        form.submit()
    }
}

class CheckForm {

    _form = HTMLFormElement
    _checkForm = Boolean
    _formResult = true

    constructor( form ) {
        this.form = form

        this.setCheckForm()
        if( this.checkForm === false ) {
            this.formResult = true
            return this.formResult
        }
    }


    get form() {
        return this._form
    }
    set form(value) {
        this._form = value
    }

    get checkForm() {
        return this._checkForm
    }
    set checkForm(value) {
        this._checkForm = value
    }

    get formResult() {
        return this._formResult
    }
    set formResult(value) {
        this._formResult = value
    }

    setCheckForm() {
        this.checkForm = this.form.getAttribute('data-js-form-check') === 'true'
    }

    checkFormFields() {
        const fields = this.form.querySelectorAll( '.form__field[data-js-form-field-check]' )
        for( let field of fields ) {
            this.checkFormField( field )
        }
        return this.formResult
    }

    checkFormField( field ) {
        const CheckFormFieldClass = new CheckFormField( field )
        const result = CheckFormFieldClass.checkField()
        if( result !== true ) {
            this.formResult = false
        }
    }

}

class CheckFormField {

    _field = HTMLElement
    _fieldValue = ''
    _fieldType = String
    _fieldTypes = [
        { 'name': 'text', 'class': 'form__field-text' },
        { 'name': 'radios', 'class': 'form__field-radios' },
        { 'name': 'checkboxes', 'class': 'form__field-checkboxes' },
        { 'name': 'checkbox', 'class': 'form__field-checkbox' }
    ]
    _fieldCheckTypes = []
    _fieldStatusText = String
    _fieldStatusErrors = ''
    _fieldResult = Boolean

    constructor( field ) {
        this.field = field

        this.setFieldType()
        this.setFieldCheckTypes()
        this.setFieldValue()

    }

    get field() {
        return this._field
    }
    set field(value) {
        this._field = value
    }

    get fieldValue() {
        return this._fieldValue
    }
    set fieldValue(value) {
        this._fieldValue = value
    }

    get fieldType() {
        return this._fieldType
    }
    set fieldType(value) {
        this._fieldType = value
    }

    get fieldTypes() {
        return this._fieldTypes
    }
    set fieldTypes(value) {
        this._fieldTypes = value
    }

    get fieldCheckTypes() {
        return this._fieldCheckTypes
    }
    set fieldCheckTypes(value) {
        this._fieldCheckTypes = value
    }

    get fieldStatusText() {
        return this._fieldStatusText
    }
    set fieldStatusText(value) {
        this._fieldStatusText = value
    }

    get fieldStatusErrors() {
        return this._fieldStatusErrors
    }
    set fieldStatusErrors(value) {
        this._fieldStatusErrors = value
    }

    get fieldResult() {
        return this._fieldResult
    }
    set fieldResult(value) {
        this._fieldResult = value
    }

    setFieldType() {

        for( let fieldType of this.fieldTypes ) {
            if( this.field.classList.contains( fieldType.class ) ) {
                this.fieldType = fieldType.name
                return true
            }
        }
        return false

    }

    setFieldValue() {

        switch( this.fieldType ) {
            case 'text':
                this.fieldValue = this.field.getElementsByTagName( 'input' )[0].value
                break
            case 'radios':
                let radioFields = this.field.getElementsByTagName( 'input' )
                for( let radioField of radioFields ) {
                    if( radioField.checked === true ) {
                        this.fieldValue = radioField.value
                    }
                }
                break
            case 'checkboxes':
                let fieldValues = []
                let checkboxFields = this.field.getElementsByTagName( 'input' )
                for( let checkboxField of checkboxFields ) {
                    if( checkboxField.checked === true ) {
                        fieldValues.push( { 'field': checkboxField, 'value': checkboxField.value } )
                    }
                }
                this.fieldValue = fieldValues
                break
            case 'checkbox':
                let checkboxField = this.field.getElementsByTagName( 'input' )[0]
                if( checkboxField.checked === true ) {
                    this.fieldValue = checkboxField.value
                }
                break
        }

    }

    setFormFieldLabelHeight() {

        switch( this.fieldType ) {
            case 'text':
                const formFieldLabelHeight = this.field.getElementsByClassName( 'form-field-label__text' )[0].clientHeight
                this.field.style.setProperty( '--form-label--height', formFieldLabelHeight )
                break
            case 'radios':
                this.field.style.setProperty( '--form-label--height', 0 )
                break
            case 'checkboxes':
                this.field.style.setProperty( '--form-label--height', 0 )
                break
            case 'checkbox':
                this.field.style.setProperty( '--form-label--height', 0 )
                break
        }

    }

    setFieldCheckTypes() {

        const checks = this.field.getAttribute( 'data-js-form-field-check' ).split( ';' )
        for( let check of checks ) {
            this.addFieldCheckType( check )
        }

    }
    addFieldCheckType( checkType ) {

        const fieldCheckTypeName = checkType.split( ':' )[0]
        const fieldCheckTypeValue = checkType.split( ':' )[1]

        let fieldCheckTypes = this.fieldCheckTypes
        fieldCheckTypes.push( { 'name': fieldCheckTypeName, 'value': fieldCheckTypeValue } )
        this.fieldCheckTypes = fieldCheckTypes

    }

    checkField() {
        this.fieldResult = true

        for( let check of this.fieldCheckTypes ) {
            switch( check.name ) {
                case 'required':
                    this.validateFieldRequired()
                    break
                case 'format':
                    this.validateFieldFormat( check.value )
                    break
                case 'min-length':
                    this.validateFieldMinLength( check.value )
                    break
                case 'max-length':
                    this.validateFieldMaxLength( check.value )
                    break
                case 'password-confirm':
                    this.validateFieldPasswordConfirm( check.value )
                    break
            }
        }

        this.setFieldStatusText()
        return this.fieldResult
    }

    validateFieldRequired() {

        if( this.fieldValue.length === 0 ) {
            this.fieldResult = false
            this.fieldStatusErrors += '<br />- Dit veld is verplicht.'
            return false
        }
        return true

    }
    validateFieldFormat( checkValue ) {
        switch( checkValue ) {
            case 'email':
                return this.validateFieldFormatEmail()
            case 'numbers':
                return this.validateFieldFormatNumbers()
            default:
                return true
        }
    }
    validateFieldFormatEmail() {
        if( !/(.*[@].*\.)/.test( this.fieldValue ) ) {
            this.fieldResult = false
            this.fieldStatusErrors += '<br />- Dit veld moet een geldig e-mailadres bevatten.'
            return false
        }
        return true
    }
    validateFieldFormatNumbers() {
        if( !/(^\d*$)/.test( this.fieldValue ) ) {
            this.fieldResult = false
            this.fieldStatusErrors += '<br />- Dit veld mag enkel cijfers bevatten.'
            return false
        }
        return true
    }
    validateFieldMinLength( checkValue ) {
        if( this.fieldValue.length < checkValue ) {
            this.fieldResult = false
            this.fieldStatusErrors += '<br />- Dit veld moet minimaal ' + checkValue + ' tekens bevatten.'
            return false
        }
        return true
    }
    validateFieldMaxLength( checkValue ) {
        if( this.fieldValue.length > checkValue ) {
            this.fieldResult = false
            this.fieldStatusErrors += '<br />- Dit veld mag maximaal ' + checkValue + ' tekens bevatten.'
            return false
        }
        return true
    }
    validateFieldPasswordConfirm( checkValue ) {

    }

    setFieldStatusText() {

        if( this.fieldResult === true ) {
            this.fieldStatusText = '<strong>Dit veld is correct ingevuld</strong>'
        } else {
            this.fieldStatusText = '<strong>Dit veld bevat de volgende errors: </strong>' + this.fieldStatusErrors
        }

        this.setFormFieldLabelHeight()
        this.field.setAttribute( 'data-js-form-field-status', this.fieldResult )
        this.field.getElementsByClassName( 'form-field-status__tooltip' )[0].innerHTML = this.fieldStatusText

    }

}