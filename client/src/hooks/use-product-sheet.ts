import { useState, useCallback, RefObject } from "react";

export function useProductSheet(
  sheetRef: RefObject<HTMLDivElement>
) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTranslateY, setStartTranslateY] = useState(0);
  
  // Start dragging the sheet
  const startDrag = useCallback((e: React.PointerEvent) => {
    if (!sheetRef.current) return;
    
    setIsDragging(true);
    setStartY(e.clientY);
    
    // Get current translation
    const transformValue = window.getComputedStyle(sheetRef.current).transform;
    const matrix = new DOMMatrix(transformValue);
    setStartTranslateY(matrix.m42); // Get Y translation value
    
    // Add event listeners for dragging
    document.addEventListener("pointermove", onDrag);
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);
    
    // Expand sheet on double tap/click
    const lastTap = sheetRef.current.getAttribute('data-last-tap');
    const now = new Date().getTime();
    const doubleTapThreshold = 300; // ms
    
    if (lastTap && now - parseInt(lastTap) < doubleTapThreshold) {
      // Double tap detected
      if (!isExpanded) {
        if (sheetRef.current) {
          sheetRef.current.style.transform = 'translateY(0)';
          setIsExpanded(true);
        }
      } else {
        if (sheetRef.current) {
          sheetRef.current.style.transform = `translateY(calc(100% - 9rem))`;
          setIsExpanded(false);
        }
      }
    }
    
    if (sheetRef.current) {
      sheetRef.current.setAttribute('data-last-tap', now.toString());
    }
    
    e.preventDefault();
  }, [sheetRef, isExpanded]);
  
  // Handle dragging
  const onDrag = useCallback((e: PointerEvent) => {
    if (!isDragging || !sheetRef.current) return;
    
    const deltaY = e.clientY - startY;
    const newTranslateY = Math.min(
      Math.max(startTranslateY + deltaY, 0),
      sheetRef.current.offsetHeight - 144
    );
    
    sheetRef.current.style.transform = `translateY(${newTranslateY}px)`;
  }, [isDragging, startY, startTranslateY, sheetRef]);
  
  // End dragging
  const endDrag = useCallback(() => {
    if (!isDragging || !sheetRef.current) return;
    
    setIsDragging(false);
    
    // Get current position
    const transformValue = window.getComputedStyle(sheetRef.current).transform;
    const matrix = new DOMMatrix(transformValue);
    const currentTranslateY = matrix.m42;
    
    // Snap to either expanded or collapsed state
    if (currentTranslateY < sheetRef.current.offsetHeight / 3) {
      // Expand
      sheetRef.current.style.transform = 'translateY(0)';
      setIsExpanded(true);
    } else {
      // Collapse
      sheetRef.current.style.transform = `translateY(calc(100% - 9rem))`;
      setIsExpanded(false);
    }
    
    // Remove event listeners
    document.removeEventListener("pointermove", onDrag);
    document.removeEventListener("pointerup", endDrag);
    document.removeEventListener("pointercancel", endDrag);
  }, [isDragging, onDrag, sheetRef]);
  
  // Function to manually expand the sheet
  const expandSheet = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
      setIsExpanded(true);
    }
  }, [sheetRef]);
  
  // Function to manually collapse the sheet
  const collapseSheet = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(calc(100% - 9rem))`;
      setIsExpanded(false);
    }
  }, [sheetRef]);

  return {
    isExpanded,
    startDrag,
    expandSheet,
    collapseSheet
  };
}
