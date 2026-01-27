
// src/components/Search/SearchBar.tsx
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSearch } from '../../../state/context/SearchContext';
import SearchDropdown from './SearchDropdown';
import './Search.scss';

const SearchBar = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    termoBusca,
    setTermoBusca,
    dropdownAberto,
    setDropdownAberto
  } = useSearch();

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [setDropdownAberto]);

  const handleFocus = () => {
    setDropdownAberto(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(e.target.value);
    setDropdownAberto(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!termoBusca.trim()) return;

    // Navega para a página de busca
    navigate(`/busca?q=${encodeURIComponent(termoBusca)}`);
    
    // Fecha dropdown
    setDropdownAberto(false);
    
    // Limpa o input
    setTermoBusca('');
    
    // Remove o foco do input
    inputRef.current?.blur();
  };

  return (
    <div className="search-container" ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <InputGroup className="search-input-group">
          <Form.Control
            ref={inputRef}
            className="search-input"
            type="search"
            placeholder="Estou buscando..."
            value={termoBusca}
            onChange={handleChange}
            onFocus={handleFocus}
            autoComplete="off"
          />
    

          <InputGroup.Text
            className="search-icon-container"
            onClick={handleSubmit}
            style={{ cursor: 'pointer' }}
          >
            <i className="bi bi-search search-icon"></i>
          </InputGroup.Text>
        </InputGroup>
      </form>

      {dropdownAberto && <SearchDropdown />}
    </div>
  );
};

export default SearchBar;