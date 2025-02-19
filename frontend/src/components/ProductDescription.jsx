import { useMemo } from 'react';
import PropTypes from 'prop-types';

export const ProductDescription = ({ description }) => {
  const content = useMemo(() => {
    if (!description) return null;

    try {
      // Try to parse the description as JSON (Editor.js format)
      const parsedContent = JSON.parse(description);
      // Check if it's an Editor.js content structure
      if (parsedContent.blocks && Array.isArray(parsedContent.blocks)) {
        return parsedContent.blocks.map((block, index) => {
          switch (block.type) {
            case 'paragraph':
              return (
                <p key={index} className="mb-4">
                  {block.data.text}
                </p>
              );
            case 'header':
              // eslint-disable-next-line no-case-declarations
              let HeaderTag = `h${block.data.level}`;
              return (
                <HeaderTag key={index} className="font-bold mb-4">
                  {block.data.text}
                </HeaderTag>
              );
            case 'list':
              // eslint-disable-next-line no-case-declarations
              const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
              return (
                <ListTag key={index} className="list-inside mb-4">
                  {block.data.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="ml-4">
                      {item}
                    </li>
                  ))}
                </ListTag>
              );
            case 'image':
              return (
                <img
                  key={index}
                  src={block.data.file.url}
                  alt={block.data.caption || ''}
                  className="mb-4 max-w-full h-auto"
                />
              );
            default:
              return null;
          }
        });
      }
    } catch {
      // If parsing fails, treat it as plain text
      return <p className="mb-4">{description}</p>;
    }
  }, [description]);

  return <div className="prose max-w-none">{content}</div>;
};

ProductDescription.propTypes = {
  description: PropTypes.string
};
