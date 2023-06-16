interface Status {
    valid: boolean,
    message?: string
}

type Rule = (value: string) => Status

export function lenght({min, max}: {min: number, max: number}) {
    return function (value: string) : Status {
        const result = Boolean(value.length > min && value.length < max)

        return {
            valid: result,
            message: result ? undefined : `This field must have between ${min} and ${max} characters`
        }
    }
}

export function required(value: string) : Status {
    const result = Boolean(value)

    return {
        valid: result,
        message: result ? undefined : 'This field is required'
    }
}

export function validate (value: string, rules: Rule[]): Status {
    for (const rule of rules) {
        const result = rule(value)
        if (!result.valid) {
            return result
        }
    }
    return {
        valid: true
    }
}


console.log(
    validate('', [required,lenght({min:5,max:10})]),
    validate('a', [lenght({min:5,max:10})]),
    validate('aaaaaaaaaaaaaaa', [lenght({min:5,max:10})]),
    validate('username', [lenght({min:5,max:10})])
)
 