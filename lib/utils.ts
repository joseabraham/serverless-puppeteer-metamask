export const isNewerVersion = (current: string, comparingWith: string): boolean => {
  if (current === comparingWith) return false;

  const currentFragments = current.replace(/[^\d.-]/g, '').split('.');
  const comparingWithFragments = comparingWith.replace(/[^\d.-]/g, '').split('.');

  const length =
    currentFragments.length > comparingWithFragments.length ? currentFragments.length : comparingWithFragments.length;
  for (let i = 0; i < length; i++) {
    if ((Number(currentFragments[i]) || 0) === (Number(comparingWithFragments[i]) || 0)) continue;
    return (Number(comparingWithFragments[i]) || 0) > (Number(currentFragments[i]) || 0);
  }
  return true;
};


export const dateFormatted = (date?: Date) =>{

  var dateObj = date ? new Date(date) : new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  let newdate = day + "/" + month + "/" + year;    
  return newdate

}

export const getHour = (date?: Date) =>{
  var dateObj = date ? new Date(date) : new Date();    
  return dateObj.getHours()+1;

}