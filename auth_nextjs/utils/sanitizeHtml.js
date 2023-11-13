// usato per Quill Editor (textarea)
import sanitizeHtml from 'sanitize-html';

const htmlSanitizer = (content) => {
    const sanitizedContent = sanitizeHtml(content, {
        // devono essere quelli usati per Quill
      allowedTags: [
        'b', 'i', 'u', 's', 'span', 'strong', 'a', 'br', 'em'
    ],
      nonBooleanAttributes: [
        'abbr', 'accept', 'accept-charset', 'accesskey', 'action',
        'allow', 'alt', 'as', 'autocapitalize', 'autocomplete',
        'blocking', 'charset', 'cite', 'class', 'color', 'cols',
        'colspan', 'content', 'contenteditable', 'coords', 'crossorigin',
        'data', 'datetime', 'decoding', 'dir', 'dirname', 'download',
        'draggable', 'enctype', 'enterkeyhint', 'fetchpriority', 'for',
        'form', 'formaction', 'formenctype', 'formmethod', 'formtarget',
        'headers', 'height', 'hidden', 'high', 'href', 'hreflang',
        'http-equiv', 'id', 'imagesizes', 'imagesrcset', 'inputmode',
        'integrity', 'is', 'itemid', 'itemprop', 'itemref', 'itemtype',
        'kind', 'label', 'lang', 'list', 'loading', 'low', 'max',
        'maxlength', 'media', 'method', 'min', 'minlength', 'name',
        'nonce', 'optimum', 'pattern', 'ping', 'placeholder', 'popover',
        'popovertarget', 'popovertargetaction', 'poster', 'preload',
        'referrerpolicy', 'rel', 'rows', 'rowspan', 'sandbox', 'scope',
        'shape', 'size', 'sizes', 'slot', 'spellcheck', 'src',
        'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style',
        'tabindex', 'target', 'title', 'translate', 'type', 'usemap',
        'value', 'width', 'wrap',
      ],
        disallowedTagsMode: 'discard',
        allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
        },
    });
  
    return sanitizedContent;
  };
  
export default htmlSanitizer;
