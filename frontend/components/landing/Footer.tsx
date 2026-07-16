export function Footer() {
  return (
    <footer className="border-t border-line/60 py-10">
      <div className="section flex flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="text-sm text-muted">
          © {new Date().getFullYear()} RDS Fintech. Todos os direitos
          reservados.
        </span>
        <div className="flex gap-6 text-sm text-muted">
          <a href="#" className="hover:text-white">
            Privacidade
          </a>
          <a href="#" className="hover:text-white">
            Termos
          </a>
          <a href="#" className="hover:text-white">
            Segurança
          </a>
        </div>
      </div>
    </footer>
  );
}
