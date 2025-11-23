# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "Se connecter" [level=1] [ref=e5]
  - generic [ref=e6]:
    - generic [ref=e7]:
      - generic [ref=e8]: Email
      - textbox "exemple_at.mail.com" [ref=e9]
    - generic [ref=e10]:
      - generic [ref=e11]: Mot de passe
      - textbox "••••••••" [ref=e12]
    - button "Se connecter" [ref=e13] [cursor=pointer]
  - paragraph [ref=e14]: Email ou mot de passe incorrect
  - paragraph [ref=e15]:
    - text: Pas encore de compte ?
    - link "S'inscrire" [ref=e16]:
      - /url: /register
```