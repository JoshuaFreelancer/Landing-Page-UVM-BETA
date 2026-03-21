# WCAG AA Checklist (Automatizable + Manual)

## Script automatico
Ejecuta:

```bash
npm run wcag:check
```

El script revisa en src/index.html:
- atributo lang
- meta description
- uso de main
- alt en imagenes
- relacion label-for con input/textarea
- texto accesible en botones

## Checklist manual recomendado (AA)
- Contraste de texto en Hero, botones y footer.
- Orden de tabulacion y foco visible en menu y formulario.
- Mensajes de error en formulario claros y anunciados por lectores.
- Confirmar que enlaces de redes tengan destinos reales y texto alternativo.
- Verificar uso de heading hierarchy sin saltos invalidos.

## Siguiente nivel (opcional)
Integrar auditoria con Lighthouse CI o axe-core en pipeline CI/CD.
