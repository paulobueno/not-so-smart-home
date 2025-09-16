No so smart home configs
- Test

Load all variables from .env into environment
```bash
export $(cat .env | xargs)
```
substitute variables and create configuration.yaml
```bash
envsubst < configuration.yaml.template > configuration.yaml
```
