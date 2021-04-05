* 在本文中，我想向您展示如何通过使用state Hooks和effect Hooks 来获取React with Hooks中的数据。我们将使用广为人知的Hacker News API从技术世界获取流行文章。您还将为数据获取实现 custom hook，这些数据获取可以在应用程序的任何地方重用，也可以作为独立的节点包发布在npm上.

* 如果您对这个新的React特性一无所知，请将本文签入React Hooks。如果您想为展示的示例签出完成的项目，这些示例展示了如何在React with Hooks中获取数据，请clone 出这个 https://github.com/the-road-to-learn-react/react-hooks-introduction 存储库.

* 如果你只是想有一个现成的钩子来抓取数据:npm安装use-data-api，并遵循文档.
* 注意: 将来,React hooks 不会用于在React中获取数据,取而代之的是一个叫做 Suspense 的功能。尽管如此，下面的演练仍然是了解React中的状态和效果挂钩的好方法.
* 如果您不熟悉React中的数据获取，请检查我的文章《在React中获取大量数据》。它将带您了解如何使用React类组件获取数据，如何使用Render Prop Component 组件和高阶组件使其可重用，以及如何处理错误处理和加载自旋器。在本文中，我想用函数组件中的React Hooks 向您展示所有这些.
* App组件显示了一个项目列表(hit = Hacker News articles)。状态和状态更新函数来自状态钩子useState，它负责管理我们将为App组件获取的数据的本地状态。初始状态是表示数据的对象中的空命中列表。目前还没有人为该数据设置任何状态.
* 我们将使用axios来获取数据，但是您可以使用另一个数据获取库或浏览器的本机获取API。如果还没有安装axios，可以使用npm install axios在命令行上安装。然后实现数据抓取的效果挂钩.
 名为useEffect的效果钩子用于使用axios从API获取数据，并使用状态钩子的update函数将数据设置为组件的本地状态。承诺解析使用async/ wait.

然而，当您运行应用程序时，您应该陷入一个糟糕的循环。effect钩子在组件挂载时运行，也在组件更新时运行。因为我们在每次数据获取之后都要设置状态，所以组件会更新并再次运行效果。它一次又一次地获取数据。这是一个错误，需要避免。我们只想在组件挂载时获取数据。这就是为什么您可以为effect hook提供一个空数组作为第二个参数，以避免在组件更新时激活它，但只在组件挂载时激活它.


第二个参数可以用来定义钩子所依赖的所有变量(在这个数组中分配)。如果其中一个变量发生变化，钩子将再次运行。如果带有变量的数组是空的，则钩子在更新组件时根本不会运行，因为它不必监视任何变量。

还有最后一个陷阱。在代码中，我们使用async/ wait从第三方API获取数据。根据文档，每个使用async注释的函数都返回一个隐式的 promise :“async函数声明定义了一个异步函数，它返回一个AsyncFunction对象。异步函数是通过事件循环异步操作的函数，使用隐式 promise 返回其结果。”。然而，effect hook应该什么也不返回，或者返回一个clean up函数。这就是为什么您可能会在开发人员控制台日志中看到以下警告:07:41:22.910 index。警告:useEffect函数必须返回一个清除函数，否则什么也不返回。不支持promise和useEffect(async() =>…)，但是可以在effect中调用异步函数。这就是为什么不允许在useEffect函数中直接使用async。让我们来实现一个解决方案，通过使用效果中的async函数。

```
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://hn.algolia.com/api/v1/search?query=redux',
      );

      setData(result.data);
    };
    fetchData();
  },[]);
  
  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;


```

简单地说，这就是使用React钩子获取数据。但是，如果您对错误处理、加载指示器、如何触发表单中的数据获取以及如何使用可重用的数据获取钩子感兴趣，请继续阅读。

> 如何通过编程/手动触发钩子?

  我们在组件挂载后获取数据。但是，如果使用输入字段告诉API我们对哪个主题感兴趣呢?“Redux”作为默认查询。但是关于“反应”的话题呢?让我们实现一个input元素，使某人能够获取除“Redux”故事之外的其他故事。因此，为输入元素引入一个新的状态。

```
import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://hn.algolia.com/api/v1/search?query=redux',
      );

      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default App;

```

目前，这两种状态彼此独立，但是现在您希望将它们耦合起来，只获取由输入字段中的查询指定的文章。通过以下更改，组件应该在挂载后按查询项获取所有文章。

缺少一个部分:当您试图在输入字段中键入一些内容时，在从效果触发挂载之后，没有其他数据获取。这是因为您提供了空数组作为效果的第二个参数。这种效果不依赖于任何变量，因此只在组件挂载时触发。但是，现在效果应该取决于查询。一旦查询发生更改，数据请求应该再次触发。

```
..

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`,
      );

      setData(result.data);
    };

    fetchData();
  }, [query]);

  return (
    ...
  );
}

export default App;

```

一旦您更改了输入字段中的值，数据的重新获取就应该工作了。但这又带来了另一个问题:对于输入字段中键入的每个字符，都会触发该效果并执行另一个数据获取请求。如何提供一个按钮来手动触发请求和钩子?

```
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`,
      );

      setData(result.data);
    };

    fetchData();
  }, [query]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button type="button" onClick={() => setSearch(query)}>
        Search
      </button>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

```

现在，使效果依赖于搜索状态，而不是随输入字段中的每个键击而变化的查询状态。一旦用户点击按钮，新的搜索状态就会被设置，并且应该手动触发效果钩子。

```

...

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [search, setSearch] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${search}`,
      );

      setData(result.data);
    };

    fetchData();
  }, [search]);

  return (
    ...
  );
}

export default App;

```
此外，搜索状态的初始状态也设置为与查询状态相同的状态，因为组件也在mount上获取数据，因此结果应该反映输入字段中的值。然而，具有类似的查询和搜索状态有点令人困惑。为什么不将实际URL设置为状态而不是搜索状态?

```

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [url, setUrl] = useState(
    'http://hn.algolia.com/api/v1/search?query=redux',
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(url);

      setData(result.data);
    };

    fetchData();
  }, [url]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </button>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

```

这是如果隐式编程数据获取与效果挂钩。您可以决定效果取决于哪个状态。在单击或其他副作用中设置此状态后，将再次运行此效果。在本例中，如果URL状态发生更改，则再次运行该效果以从API获取新闻。


>  带 React Hooks 的加载指示器

让我们为数据获取引入一个加载指示器。它只是另一个由状态钩子管理的状态。加载标志用于在App组件中呈现加载指示器。

```
import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [url, setUrl] = useState(
    'http://hn.algolia.com/api/v1/search?query=redux',
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const result = await axios(url);

      setData(result.data);
      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </button>

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;

```

当组件挂载或URL状态更改时，调用该效果来获取数据，加载状态被设置为true。一旦请求解析，加载状态再次设置为false。

> 使用 React Hooks 处理错误.

使用React钩子获取数据时的错误处理呢?错误只是用状态钩子初始化的另一种状态。一旦出现错误状态，App组件就可以为用户提供反馈。当使用async/ wait时，通常使用try/catch块来处理错误。你可以这样做的效果:

```

import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [url, setUrl] = useState(
    'http://hn.algolia.com/api/v1/search?query=redux',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </button>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;


```

每次钩子再次运行时，都会重置错误状态。这很有用，因为在请求失败之后，用户可能希望再次尝试，这应该会重置错误。为了自己强制执行错误，您可以将URL更改为无效的内容。然后检查错误消息是否出现。

> 使用表单获取数据并进行响应

获取数据的正确形式是什么?到目前为止，我们只有输入字段和按钮的组合。一旦您引入了更多的输入元素，您可能想要用表单元素来包装它们。此外，表单还可以触发键盘上带有“Enter”的按钮.

```

function App() {
  ...

  return (
    <Fragment>
      <form
        onSubmit={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      ...
    </Fragment>
  );
}

```

但是现在浏览器在单击submit按钮时重新加载，因为这是浏览器在提交表单时的固有行为。为了防止默认行为，我们可以对React事件调用一个函数。在React类组件中也是这样做的

```
function App() {
  ...

  return (
    <Fragment>
      <form onSubmit={event => {
        setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);

        event.preventDefault();
      }}>
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      ...
    </Fragment>
  );
}

```

现在，当您单击submit按钮时，浏览器不应该再重新加载。它和以前一样工作，但这次使用的是表单而不是简单的输入字段和按钮组合。你也可以按键盘上的“Enter”键


> 自定义数据获取 Hook.

为了提取用于数据抓取的自定义钩子，将属于数据抓取的所有东西(除了属于输入字段的查询状态，但包括加载指示器和错误处理)移动到它自己的函数中。还要确保从应用程序组件中使用的函数中返回所有必要的变量。

```
const useHackerNewsApi = () => {
  const [data, setData] = useState({ hits: [] });
  const [url, setUrl] = useState(
    'http://hn.algolia.com/api/v1/search?query=redux',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return [{ data, isLoading, isError }, setUrl];
}

```

现在，你的新钩子可以再次在App组件中使用:

```
function App() {
  const [query, setQuery] = useState('redux');
  const [{ data, isLoading, isError }, doFetch] = useHackerNewsApi();

  return (
    <Fragment>
      <form onSubmit={event => {
        doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);

        event.preventDefault();
      }}>
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      ...
    </Fragment>
  );
}


```

初始状态也可以是通用的。简单地传递到新的自定义钩子:

```

import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return [{ data, isLoading, isError }, setUrl];
};

function App() {
  const [query, setQuery] = useState('redux');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=redux',
    { hits: [] },
  );

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch(
            `http://hn.algolia.com/api/v1/search?query=${query}`,
          );

          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;

```

这就是使用自定义钩子获取数据的方法。钩子本身对API一无所知。它从外部接收所有参数，只管理必要的状态，如数据、加载和错误状态。它执行请求并将数据作为自定义数据获取钩子返回给组件.


> Reducer Hook for 数据请求.

到目前为止，我们已经使用了各种状态钩子来管理数据获取状态、加载状态和错误状态。然而，不知何故，所有这些状态，通过它们自己的状态挂钩管理，都属于一个整体，因为它们关心的是相同的原因。如您所见，它们都在数据获取函数中使用。它们一个接一个地被使用(例如setIsError、setIsLoading)，这是它们属于同一类的一个很好的指标。让我们用一个Reducer Hook把这三者结合起来。

一个Reducer Hook返回一个状态对象和一个函数来改变状态对象。这个函数称为分派函数，它采取一个动作，该动作具有一个类型和一个可选的有效负载。所有这些信息都在实际的Reducer Hook函数中使用，以从以前的状态(动作的可选负载和类型)提取一个新状态。让我们看看这在代码中是如何工作的:

```
import React, {
  Fragment,
  useState,
  useEffect,
  useReducer,
} from 'react';
import axios from 'axios';

const dataFetchReducer = (state, action) => {
  ...
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  ...
};

```
Reducer Hook 以 Reducer 函数和初始状态对象为参数。在我们的例子中，数据、加载和错误状态的初始状态的参数没有变化，但是它们被聚合到一个由一个reducer hook 管理的状态对象中，而不是单个 state hooks.

```
const dataFetchReducer = (state, action) => {
  ...
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await axios(url);

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    };

    fetchData();
  }, [url]);

  ...
};
```

现在，在获取数据时，可以使用dispatch函数向reducer函数发送信息。使用dispatch发送的对象具有强制类型属性和可选有效负载属性。该类型告诉reducer机函数需要应用哪个状态转换，reducer还可以使用负载提取新状态。毕竟，我们只有三个状态转换:初始化抓取过程，通知成功的数据抓取结果，以及通知错误的数据抓取结果。

在自定义钩子的末尾，状态像以前一样返回，但是因为我们有一个状态对象，而不再是独立的状态。这样，调用useDataApi自定义钩子的人仍然可以访问数据、isLoading和isError:

```
const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  ...

  return [state, setUrl];
};

```

最后但并非最不重要的是，缺少了redurce函数的实现。它需要处理三个不同的状态转换，分别称为FETCH_INIT、FETCH_SUCCESS和FETCH_FAILURE。每个状态转换都需要返回一个新的状态对象。让我们看看如何用switch case语句实现这一点:

```
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state };
    case 'FETCH_SUCCESS':
      return { ...state };
    case 'FETCH_FAILURE':
      return { ...state };
    default:
      throw new Error();
  }
};

```

reducer 函数可以通过其参数访问当前状态和传入的操作。到目前为止，在out switch case语句中，每个状态转换只返回前一个状态。析构语句用于保持状态对象不可变(即状态永远不会被直接更改)，以执行最佳实践。现在让我们重写一些当前状态返回的属性，以便在每次状态转换时更改状态:

现在，每个状态转换(由操作的类型决定)都返回一个基于先前状态和可选有效负载的新状态。例如，在请求成功的情况下，有效负载用于设置新状态对象的数据。


总之，reudcer hook 确保使用自己的逻辑封装状态管理的这一部分。通过提供操作类型和可选有效负载，您总是会得到可预测的状态更改。此外，您永远不会遇到无效状态。例如，以前可能会意外地将isLoading和isError状态设置为true。在这种情况下，UI中应该显示什么?现在，由减速函数定义的每个状态转换都指向一个有效的状态对象.


参考文献:
https://www.robinwieruch.de/react-hooks-fetch-data/
redux 项目: https://www.youtube.com/watch?v=R_7XRX7nLsw

* 源代码练习:
* https://github.com/the-road-to-learn-react/react-hooks-introduction.


