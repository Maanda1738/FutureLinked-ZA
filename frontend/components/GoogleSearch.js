/**
 * Google Custom Search Engine Component
 * Displays a Google-powered search box on your site
 */

export default function GoogleSearch({ className = '' }) {
  return (
    <div className={`google-search-container ${className}`}>
      <div className="gcse-search"></div>
      
      <style jsx>{`
        .google-search-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        
        /* Customize Google Search appearance */
        .google-search-container :global(.gsc-control-cse) {
          padding: 0;
          border: none;
          background-color: transparent;
        }
        
        .google-search-container :global(.gsc-input-box) {
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          padding: 4px;
        }
        
        .google-search-container :global(.gsc-input-box:focus-within) {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .google-search-container :global(.gsc-search-button) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .google-search-container :global(.gsc-search-button:hover) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
      `}</style>
    </div>
  );
}
